import { google } from "googleapis";
import moment from "moment";
import { makeDb } from "../db-config.js";
import fs from "fs";
import path from "path";
import {
  createMimeMessage,
  getEmailAttachments,
  getEmailBody,
  getOauthClient,
  getRedirectUrl,
  storeError,
} from "../helper/general.js";
import asyncHandler from "express-async-handler";
import { SOCIAL_MEDIA } from "../helper/constants.js";
import { getSecrets, saveSecrets } from "./socialMediaSecretController.js";

const db = makeDb();

// oauth2Client.on("tokens", async (tokens) => {
//   console.log("tokens: ", tokens);
//   if (tokens?.refresh_token) {
//     await saveAccessToken(1, tokens.refresh_token);
//   }
// });

export const handleGoogleLogin = asyncHandler(async (req, res) => {
  try {
    const { client_id, client_secret } = req.body;
    const [secret] = await getSecrets(SOCIAL_MEDIA.GOOGLE);

    const oauth2Client = new google.auth.OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: secret.valid_oauth_uri,
    });
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://mail.google.com/",
      ],
    });

    await saveSecrets(req.body, secret.id);
    res.status(200).json({ status: true, redirectUrl: authorizeUrl });
  } catch (error) {
    storeError(error);
    console.error("Error during Google login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const handleGoogleCallback = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.GOOGLE);

    const oauth2Client = new google.auth.OAuth2({
      clientId: secret.client_id,
      clientSecret: secret.client_secret,
      redirectUri: secret.valid_oauth_uri,
    });
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, expiry_date } = tokens;
    const expiryTimeInSeconds = (expiry_date - Date.now()) / 1000;
    const expires_at = moment().add(expiryTimeInSeconds, "seconds").format("YYYY-MM-DD HH:mm:ss");

    await saveSecrets({ access_token, refresh_token, expires_at }, secret.id);
    res.json({ status: true });
    // res.redirect(`${process.env.FRONTEND_URI}?tab=google`);
  } catch (error) {
    storeError(error);
    console.error("Error during Google callback:", error);
    return res.status(500).json({ status: false, error: "Failed to get access token" });
  }
});

export const getGmailProfile = asyncHandler(async (req, res) => {
  try {
    const oauth2Client = await getOauthClient();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    // const list = await gmail.users.labels.list({
    //   userId: "me",
    // });
    const response = await gmail.users.getProfile({ userId: "me" });
    await db.query(
      `UPDATE social_media_secrets SET social_media_id = '${response.data.emailAddress}' WHERE type = '${SOCIAL_MEDIA.GOOGLE}'`
    );
    return res.status(200).json({ status: true, data: response.data });
  } catch (error) {
    storeError(error);
    console.error("Error during getting gmail profile:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const getGmailLabels = asyncHandler(async (req, res) => {
  try {
    const oauth2Client = await getOauthClient();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const labelsResponse = await gmail.users.labels.list({
      userId: "me",
    });

    const labels = labelsResponse.data.labels;

    const detailedLabels = await Promise.all(
      labels.map(async (label) => {
        const labelDetailsResponse = await gmail.users.labels.get({
          userId: "me",
          id: label.id,
        });

        return {
          id: label.id,
          name: labelDetailsResponse.data.name,
          messageCount: labelDetailsResponse.data.messagesTotal,
        };
      })
    );

    const response = await gmail.users.getProfile({ userId: "me" });
    await db.query(
      `UPDATE social_media_secrets SET social_media_id = '${response.data.emailAddress}' WHERE type = '${SOCIAL_MEDIA.GOOGLE}'`
    );
    return res.status(200).json({ status: true, data: detailedLabels });
  } catch (error) {
    storeError(error);
    console.error("Error during getting gmail labels:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const getAllEmails = asyncHandler(async (req, res) => {
  try {
    const { label, pageToken, search } = req.query;

    const oauth2Client = await getOauthClient();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const totalEmailCountResponse = await gmail.users.messages.list({
      userId: "me",
      labelIds: label ? [label.toUpperCase()] : [],
      q: search ? `"${search}"` : "",
    });

    const totalEmailCount = totalEmailCountResponse.data.resultSizeEstimate || 0;
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: label ? [label.toUpperCase()] : [],
      // pageToken: pageToken || "",
      q: search ? `"${search}"` : "",
      // maxResults: 10,
    });

    const messages = response.data.messages || [];
    const emailList = await Promise.all(
      messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        const labels = messageDetails.data.labelIds;
        const headers = messageDetails.data.payload.headers;
        const subject = headers.find((header) => header.name === "Subject")?.value;
        const starred = labels.includes("STARRED");
        const from = headers.find((header) => header.name === "From")?.value;
        const to = headers.find((header) => header.name === "To")?.value;
        const date = headers.find((header) => header.name === "Date")?.value;
        const localDate = moment(date).local().format("ddd, MMM Do YYYY, h:mm:ss A");

        const snippet = messageDetails.data.snippet;

        return {
          id: message.id,
          threadId: message.threadId,
          from,
          to,
          subject,
          snippet,
          date: localDate,
          starred,
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: {
        messages: emailList,
        nextPageToken: response.data.nextPageToken || null,
        resultSizeEstimate: response.data.resultSizeEstimate || 0,
        totalEmailCount,
      },
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const getEmailMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const oauth2Client = await getOauthClient();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "full",
    });

    const message = response.data;
    const label = message.labelIds[0];

    // Parse email details
    const headers = message.payload.headers;
    const payload = message.payload;
    const subject = headers.find((header) => header.name === "Subject")?.value;
    const from = headers.find((header) => header.name === "From")?.value;
    const to = headers.find((header) => header.name === "To")?.value;
    const date = headers.find((header) => header.name === "Date")?.value;
    const localDate = moment(date).local().format("ddd, MMM Do YYYY, h:mm:ss A");

    // Parse email body

    const body = getEmailBody(payload, label);

    // Parse email attachments
    const attachments = getEmailAttachments(payload);
    for (let attachment of attachments) {
      // const filename = attachment.filename;
      const attachmentId = attachment.attachmentId;
      const attachmentResponse = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: id,
        id: attachmentId,
      });
      const attachmentData = attachmentResponse.data.data;
      // attachment.base64EncodedAttachment = attachmentData;

      // Save attachment data to a file
      const dir = path.join(process.cwd(), "public", "gmail");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const fileName = `${Date.now()}_${attachment.filename}`;
      const filePath = path.join(dir, fileName);
      const buffer = Buffer.from(attachmentData, "base64"); // Decode from base64 to buffer
      fs.writeFileSync(filePath, buffer);

      attachment.attachmentPath = `/gmail/${fileName}`;
    }

    return res.status(200).json({
      status: true,
      data: { id: message.id, threadId: message.threadId, subject, from, to, date: localDate, body, attachments },
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const sendEmail = asyncHandler(async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    let cc = [];
    let bcc = [];
    if (req.body.cc) {
      cc = JSON.parse(req.body.cc);
    }
    if (req.body.bcc) {
      bcc = JSON.parse(req.body.bcc);
    }

    let attachments = [];
    if (req.files) {
      const fileKeys = Object.keys(req.files).filter((key) => key.startsWith("attachment["));

      attachments = fileKeys.map((key) => ({
        name: req.files[key].name,
        data: req.files[key].data,
        mimeType: req.files[key].mimetype,
        path: req.files[key].tempFilePath || req.files[key].name,
      }));
    }
    // const from = "mohammad.tariq.sartia@gmail.com";
    const [secret] = await getSecrets(SOCIAL_MEDIA.GOOGLE);
    const from = secret.social_media_id;
    const messageParts = [];
    messageParts.push({ part: { body: { data: body }, mimeType: "text/plain" } });

    let base64FileData;
    attachments.forEach((attachment) => {
      messageParts.push({
        part: {
          filename: attachment.name,
          body: { data: attachment.data },
          mimeType: attachment.mimeType,
        },
      });
    });

    const message = {
      raw: Buffer.from(createMimeMessage(messageParts, from, to, subject, cc, bcc)).toString("base64"),
    };

    const oauth2Client = await getOauthClient();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: message.raw,
      },
    });
    res.status(201).json({ status: true, message: "Email sent successfully", data: response.data, base64FileData });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const deleteEmail = asyncHandler(async (req, res) => {
  try {
    const ids = req.body.ids;
    const oauth2Client = await getOauthClient();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    await gmail.users.messages.batchDelete({
      userId: "me",
      requestBody: {
        ids: ids,
      },
    });

    return res.status(200).json({ status: true, message: "Email deleted successfully" });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const createUpdateDraft = asyncHandler(async (req, res, next) => {
  try {
    const { id, to, subject, body } = req.body;

    let cc = [];
    let bcc = [];
    if (req.body.cc) {
      cc = JSON.parse(req.body.cc);
    }
    if (req.body.bcc) {
      bcc = JSON.parse(req.body.bcc);
    }

    let attachments = [];
    if (req.files) {
      const fileKeys = Object.keys(req.files).filter((key) => key.startsWith("attachment["));

      attachments = fileKeys.map((key) => ({
        name: req.files[key].name,
        data: req.files[key].data,
        mimeType: req.files[key].mimetype,
        path: req.files[key].tempFilePath || req.files[key].name,
      }));
    }
    // const from = "mohammad.tariq.sartia@gmail.com";
    const [secret] = await getSecrets(SOCIAL_MEDIA.GOOGLE);
    const from = secret.social_media_id;
    const messageParts = [];
    messageParts.push({ part: { body: { data: body }, mimeType: "text/plain" } });

    attachments.forEach((attachment) => {
      messageParts.push({
        part: {
          filename: attachment.name,
          body: { data: attachment.data },
          mimeType: attachment.mimeType,
        },
      });
    });

    const raw = Buffer.from(createMimeMessage(messageParts, from, to, subject, cc, bcc)).toString("base64");

    const oauth2Client = await getOauthClient();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    if (id) {
      const response = await gmail.users.drafts.update({
        userId: "me",
        id: id,
        resource: {
          message: {
            raw: raw,
          },
        },
      });
      res.status(201).json({ status: true, message: "Draft updated successfully", data: response.data });
      return;
    }

    const response = await gmail.users.drafts.create({
      userId: "me",
      resource: {
        message: {
          raw: raw,
        },
      },
    });
    res.status(201).json({ status: true, message: "Draft saved successfully", data: response.data });
  } catch (error) {
    storeError(error);
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const sendDraft = asyncHandler(async (req, res, next) => {
  try {
    const oauth2Client = await getOauthClient();
    const id = req.body.id;
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.drafts.send({
      userId: "me",
      requestBody: {
        id: id,
      },
    });
    res.status(201).json({ status: true, message: "Draft sent successfully", data: response.data });
  } catch (error) {
    storeError(error);
    console.log("error: ", error);
    return res.status(500).json({ status: false, error: error.message });
  }
});
export const getDraft = asyncHandler(async (req, res, next) => {
  try {
    const oauth2Client = await getOauthClient();
    const draftId = req.params.draftId;
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    if (draftId) {
      let response = await gmail.users.drafts.get({
        userId: "me",
        id: draftId,
      });
      const draftMessage = response.data.message;
      const payload = draftMessage.payload;
      const label = draftMessage.labelIds[0];

      // Get headers (From, To, Subject, Date, etc.)
      const headers = payload.headers;
      const subject = headers.find((header) => header.name === "Subject")?.value;
      const from = headers.find((header) => header.name === "From")?.value;
      const to = headers.find((header) => header.name === "To")?.value;
      const date = headers.find((header) => header.name === "Date")?.value;
      const localDate = moment(date).local().format("ddd, MMM Do YYYY, h:mm:ss A");

      const cc = headers.find((header) => header.name === "Cc")?.value || "";
      const bcc = headers.find((header) => header.name === "Bcc")?.value || "";
      const body = getEmailBody(payload, label);

      // Parse email attachments
      const attachments = getEmailAttachments(payload);
      for (let attachment of attachments) {
        // const filename = attachment.filename;
        const attachmentId = attachment.attachmentId;
        const attachmentResponse = await gmail.users.messages.attachments.get({
          userId: "me",
          messageId: draftMessage.id,
          id: attachmentId,
        });
        const attachmentData = attachmentResponse.data.data;
        // attachment.base64EncodedAttachment = attachmentData;

        // Save attachment data to a file
        const dir = path.join(process.cwd(), "public", "gmail");
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        const fileName = `${Date.now()}_${attachment.filename}`;
        const filePath = path.join(dir, fileName);
        const buffer = Buffer.from(attachmentData, "base64"); // Decode from base64 to buffer
        fs.writeFileSync(filePath, buffer);

        attachment.attachmentPath = `/gmail/${fileName}`;
      }

      return res.status(200).json({
        status: true,
        data: {
          id: draftMessage.id,
          threadId: draftMessage.threadId,
          subject,
          from,
          to,
          cc,
          bcc,
          date: localDate,
          body,
          attachments,
        },
      });
    }
    let response = await gmail.users.drafts.list({
      userId: "me",
    });

    const messages = response.data.drafts || [];
    const emailList = await Promise.all(
      messages.map(async (message) => {
        const { data } = await gmail.users.drafts.get({
          userId: "me",
          id: message.id,
        });

        const headers = data.message.payload.headers;
        const subject = headers.find((header) => header.name === "Subject")?.value;
        const from = headers.find((header) => header.name === "From")?.value;
        const to = headers.find((header) => header.name === "To")?.value;
        const date = headers.find((header) => header.name === "Date")?.value;
        const localDate = moment(date).local().format("ddd, MMM Do YYYY, h:mm:ss A");

        const snippet = data.message.snippet;

        return {
          id: message.id,
          threadId: message.threadId,
          from,
          to,
          subject,
          snippet,
          date: localDate,
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: {
        messages: emailList,
        nextPageToken: response.data.nextPageToken || null,
        resultSizeEstimate: response.data.resultSizeEstimate || 0,
        // totalEmailCount,
      },
    });
    res.status(201).json({ status: true, message: "Draft fetched successfully", data: response.data });
  } catch (error) {
    storeError(error);
    console.log("error: ", error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const deleteDraft = asyncHandler(async (req, res) => {
  try {
    const ids = req.body.ids;

    const oauth2Client = await getOauthClient();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    for (let id of ids) {
      await gmail.users.drafts.delete({
        userId: "me",
        id: id,
      });
    }
    return res.status(200).json({ status: true, message: "Draft deleted successfully" });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const toggleStarEmail = asyncHandler(async (req, res, next) => {
  try {
    const { messageId, star } = req.body;

    if (!messageId) {
      return res.status(400).json({ status: false, error: "messageId is required" });
    }

    // 'star' should be a boolean indicating whether to star or unstar
    if (star === undefined) {
      return res.status(400).json({ status: false, error: "'star' is required (true to star, false to unstar)" });
    }

    const oauth2Client = await getOauthClient();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Determine whether to add or remove the 'STARRED' label
    const labelAction = star ? { addLabelIds: ["STARRED"] } : { removeLabelIds: ["STARRED"] };

    // Modify the message to add or remove the 'STARRED' label based on 'star' value
    const response = await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: labelAction,
    });

    res.status(200).json({
      status: true,
      message: star ? "Email starred successfully" : "Email unstarred successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error toggling star on email:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
});
