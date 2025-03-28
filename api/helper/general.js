import crypto from "crypto";
import bcrypt from "bcryptjs";
import path from "path";
import he from "he";
import fs from "fs";
import FormData from "form-data";
import moment from "moment";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import axios from "axios";
import PDFDocument  from "pdfkit";
import { makeDb } from "../db-config.js";
import { fileURLToPath } from "url";
import Post from "../sequelize/postSchema.js";
import { LINKEDIN, META, SOCIAL_MEDIA } from "./constants.js";
import { getSecrets, saveSecrets } from "../Controller/socialMediaSecretController.js";
import Notification from "../sequelize/notificationSchema.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = makeDb();

/**Get all country Name list */
export const getCountryName = async () => {
  return await db.query(`SELECT id, name FROM country`);
};

/**Fetch all state name according to country id*/
export const getStateName = async (countryId) => {
  return await db.query(`SELECT id, name FROM states WHERE country_id='${countryId}'`);
};

/**Fetch all city name according to state id */
export const getCityName = async (stateId) => {
  return await db.query(`SELECT id, name FROM cities WHERE state_id='${stateId}'`);
};

/**Get Random Number */
export const getRandomNumber = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
};

/**Helper for inserting record in activity log */
export const insertActivityLog = async (created_by, status, module, id) => {
  let message = "";
  if (status == "update") {
    message = `${module} updated successfully with id ${id}`;
  } else if (status == "create") {
    message = `New ${module} created successfully with id ${id}`;
  } else if (status == "delete") {
    message = `${module} deleted successfully with id ${id}`;
  } else if (status == "approved") {
    message = `${module} approved successfully with id ${id}`;
  } else if (status == "reject") {
    message = `${module} reject successfully with id ${id}`;
  }

  return await db.query(
    `INSERT INTO activity_log(created_by, status,module, message) VALUES ("${created_by}","${status}","${module}","${message}")`
  );
};

/**Function to store error in error log file */
export const storeError = async (error) => {
  console.log(error);
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const errorMessage = `${currentTime} - Error: ${error.stack}\n`;
  fs.appendFile("error.log", errorMessage, (err) => {
    if (err) console.error("Error writing to error log:", err);
  });
};

/**Function to remove extra symbols */
export const removeExtraSymbols = async (record) => {
  if (record) {
    let cleanedDesc = record.replace(/"/g, "'");
    return cleanedDesc;
  }
};

/**Function to make string into where in format */
export const inWhereFormat = async (arrayString) => {
  const arr = Array.isArray(arrayString) ? arrayString : JSON.parse(arrayString);
  if (!Array.isArray(arr)) throw new Error("Input is not a valid array.");
  const data = "(" + arr.join(",") + ")";
  return data;
};

export const uploadFile = async (folder, file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const folderPath = path.join(__dirname, `../public/${folder}/`);
    const uploadPath = path.join(__dirname, `../public/${folder}/`, fileName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const storePath = `/${folder}/${fileName}`;
    await file.mv(uploadPath);
    return storePath;
  } catch (error) {
    storeError(error);
  }
};

export const saveBase64Image = (base64String, folderPath, prefix = "file") => {
  if (!base64String.includes(";base64,")) {
    throw new Error("Invalid image format");
  }

  // Extract MIME type and Base64 data
  const [mimeType, base64Data] = base64String.split(";base64,");

  // Determine file extension from MIME type
  const extension = mimeType.split("/")[1]; // e.g., "image/png" -> "png"

  // Generate a unique filename with the correct extension
  const fileName = `${prefix}_${Date.now()}.${extension}`;

  // Set up the folder path under `public`
  const fullFolderPath = path.join("public", folderPath);
  if (!fs.existsSync(fullFolderPath)) {
    fs.mkdirSync(fullFolderPath, { recursive: true });
  }

  // Define the full file path
  const filePath = path.join(fullFolderPath, fileName);

  // Save the file
  fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

  // Return the relative path starting with "/"
  return `/${folderPath}/${fileName}`;
};

/**function to get the name of user */
export const getUserName = async (id) => {
  const result = await db.query(`SELECT name FROM users WHERE id = ?`, [id]);
  return result[0]?.name ?? "";
};

/**function to get the name of user */
export const getLevelDetails = async (id) => {
  const result = await db.query(`SELECT id,name,profile FROM users WHERE id = ?`, [id]);
  return result[0] ?? [];
};

/**function to encode html content */
export const encodedData = async (data) => {
  if (data) {
    return he.encode(data);
  }
  return null;
};

// Function to Decode data
export const decodeData = async (data, name) => {
  if (data) {
    return he.decode(data);
  }
  return null;
};

// to check name is already exits or not from this table
export const checkNameAlreadyExits = async (tableName, fieldName, fieldData, organization) => {
  let org = organization ? `AND organization = '${organization}'` : "";
  const query = `select * from ${tableName}  where deleted='0' AND ${fieldName}=? ${org}`;
  const getData = await db.query(query, [fieldData]);
  return getData.length > 0;
};

// Function to encode single simple statements
// export const encodeSingle_statement = async (data) => {
//   if (data) {
//     return he.encode(data);
//   }
//   return null;
// };

// Function to decode simple single statements
// export const decodeSingle_statement = async (data) => {
//   if (data) {
//     return he.decode(data);
//   }
//   return null;
// };

export const insertNotification = async (subject, message, user, messageType, sender) => {
  const insertNotificationQuery = `INSERT INTO notification(subject, message, user_id, type, created_by) VALUES (?, ?, ?, ?, ?)`;
  const insertNotification = await db.query(insertNotificationQuery, [subject, message, user, messageType, sender]);
  return true;
};

export const makeWhereCondition = async (
  table,
  pageNumber,
  showAll,
  pageSizeNo,
  id,
  filterString = "",
  columnName = "id"
) => {
  let filter = {};
  if (typeof filterString === "string" && filterString.trim() !== "") {
    filter = JSON.parse(filterString);
  }
  const page = parseInt(pageNumber) || 1;
  const pageSize = parseInt(pageSizeNo) || 10;
  const offset = (page - 1) * pageSize;
  const where = id ? `AND ${table}.${columnName} = ${id}` : "";
  let whereFilter = "";
  let whereFilterRecord = Object.entries(filter)
    .filter(([key, value]) => value !== "") // Remove entries with empty values
    .map(([key, value]) => `${table}.${key} = '${value}'`)
    .join(" AND ");
  if (whereFilterRecord !== "") {
    whereFilter = `AND ${whereFilterRecord}`;
  }

  const pagination = showAll === "false" ? `LIMIT ${pageSize} OFFSET ${offset}` : "";
  const returnQuery = `${where} ${whereFilter} ORDER BY id ASC ${pagination}`;
  return returnQuery;
};

/**Function to make joins */
export const makeJoins = (joins) => {
  let query = ``;
  if (joins && joins.length > 0) {
    joins.forEach((join) => {
      const { type, targetTable, onCondition } = join;
      query += ` ${type.toUpperCase()} JOIN ${targetTable} ON ${onCondition}`;
    });
  }
  return query;
};

/**Count Query Condition */
export const countQueryCondition = async (table, searchCondition = "", condition = "", joinsRecord = "") => {
  try {
    let query = `SELECT count(${table}.id) as total FROM ${table} ${joinsRecord} WHERE ${table}.deleted = 0 ${searchCondition}`;
    // return console.log(query);

    if (condition !== null) {
      const orderByIndex = condition.toUpperCase().indexOf("ORDER BY");
      const checkCondition = orderByIndex !== -1 ? condition.substring(0, orderByIndex) : condition;
      query += `${checkCondition}`;
    }
    const totalCount = await db.query(query);
    return totalCount[0]?.total ?? 0;
  } catch (error) {
    storeError(error);
    console.log(error);
  }
};

/**Function to delete record according to table*/
export const deleteRecord = async (table, id) => {
  const deleteRecordData = await db.query(`UPDATE ${table} SET deleted=1 WHERE id= ${id}`);
  return deleteRecordData;
};

/**Function to get tables record details according to given record */
export const tableRecord = async (field, value, table) => {
  const tableDataRecordQuery = `SELECT * FROM ${table} WHERE deleted = "0" AND ${field} = ?`;
  const tableDataRecord = await db.query(tableDataRecordQuery, [value]);
  return tableDataRecord;
};

/**Function to get tables record details according to given record */
export const tableRecordAccordingToMultipleWhere = async (fields, values, table) => {
  // Construct the WHERE clause dynamically based on the fields and values arrays
  let whereClause = 'deleted = "0"';
  fields.forEach((field, index) => {
    whereClause += ` AND ${field} = ?`;
  });

  // Construct the SQL query with the dynamic WHERE clause
  const tableDataRecordQuery = `SELECT * FROM ${table} WHERE ${whereClause}`;
  const tableDataRecord = await db.query(tableDataRecordQuery, values);
  // console.log("tableDataRecordQuery", tableDataRecordQuery  );
  // return console.log("value", values);
  return tableDataRecord;

  // const tableDataRecordQuery = `SELECT * FROM ${table} WHERE deleted = "0" AND ${field} = ?`;
  // const tableDataRecord = await db.query(tableDataRecordQuery, [value]);
  // return tableDataRecord;
};

/**Function to get tables record details according to given record */
export const makeLoopAndGetMultipleUsersDetails = async (meetings, returnName) => {
  /**Make loop for getting record of teams members details according to team leaders */
  for (const team of meetings) {
    const teamMembers = JSON.parse(team.participants);
    if (teamMembers.length > 0) {
      const teamsMembersQuery = `SELECT id,concat (name , ' ' , surname) as name,profile FROM users WHERE id IN (${teamMembers.join(
        ", "
      )})`;
      const teamsMembers = await db.query(teamsMembersQuery);
      team.team_leader_name = await getUserName(team.team_leader);
      team.created_by_name = await getUserName(team.created_by);
      team[returnName] = teamsMembers;
    }
  }
  return meetings;
};

/**Function to print sql query */
export const queryHelper = async (query, values) => {
  return query.replace(/\?/g, () => {
    const value = values.shift();
    return value !== undefined ? (typeof value === "string" ? `'${value}'` : value) : '""';
  });
};

/**Function to insert legation document */
export const deleteAllRecord = async (req, res) => {
  try {
    const { ids, table } = req.body;

    for (const id of ids) {
      const deleteRecordQuery = await deleteRecord(table, id);

      if (deleteRecordQuery) {
        /**Insert record for activity log */
        insertActivityLog(req.user.sessionid, "delete", table, id);
      }
    }
    return res.status(200).json({
      status: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/** Record Id exist or not check */

export const recordIdExist = async (table, id) => {
  if (isNaN(id)) return false;
  const recordIdExistQuery = `SELECT * FROM ${table} WHERE id = ${id} AND deleted = 0`;
  const recordIdExist = await db.query(recordIdExistQuery);
  return recordIdExist.length > 0;
};

/*Function for delete multiple docs*/

export const deleteFile = (mediaPath) => {
  const filePath = path.join(process.cwd(), "public", mediaPath);
  // console.log(folderPath);
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    } else {
      return true;
    }
  });
};
export const deleteFilesInFolder = async (folderName) => {
  const folderPath = path.join(__dirname, `../public/${folderName}`);

  // Check if folder exists before attempting to delete files
  if (fs.existsSync(folderPath)) {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Failed to read directory:", err);
        return;
      }

      // Loop through all files in the folder and delete them
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete file:", filePath, err);
          }
        });
      });
    });
  } else {
    console.log("Folder does not exist:", folderPath);
  }
};

export const createQueryBuilder = (model, requestBody) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }
  requestBody = JSON.parse(JSON.stringify(requestBody));

  const columns = Object.keys(model.rawAttributes);
  const filteredColumns = columns.filter((column) => {
    return (
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== null &&
      requestBody[column] !== "" && // Exclude empty strings
      !(model.rawAttributes[column].allowNull === false && !requestBody[column]) // Check if required field is missing
    );
  });

  const placeholders = Array.from({ length: filteredColumns.length }, () => `?`).join(", ");
  const columnNames = filteredColumns.join(", ");

  const query = `INSERT INTO ${model.tableName}(${columnNames}) VALUES (${placeholders})`;

  const values = filteredColumns.map((column) => requestBody[column]);

  return {
    query: query,
    values: values,
  };
};

export const updateQueryBuilder = (model, requestBody) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }
  requestBody = JSON.parse(JSON.stringify(requestBody));

  // console.log(requestBody);

  const columns = Object.keys(model.rawAttributes);

  // Identify primary keys and autoincrement keys
  const primaryKeyColumns = columns.filter(
    (column) => model.rawAttributes[column].primaryKey || model.rawAttributes[column].autoIncrement
  );

  // Filter columns to update, excluding primary keys and autoincrement keys
  const filteredColumns = columns.filter((column) => {
    return (
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== "" &&
      !model.rawAttributes[column].primaryKey &&
      !model.rawAttributes[column].autoIncrement
    );
  });

  // Generate SET part of the update query
  const setStatements = filteredColumns.map((column) => `${column} = ?`).join(", ");

  // Generate WHERE part of the update query with primary keys
  const whereClauses = primaryKeyColumns
    .filter((column) => requestBody.hasOwnProperty(column))
    .map((column) => `${column} = ?`);

  if (whereClauses.length === 0) {
    throw new Error("No primary key value provided for the update operation.");
  }

  const whereClause = whereClauses.join(" AND ");

  const query = `UPDATE ${model.tableName} SET ${setStatements} WHERE ${whereClause}`;

  const values = filteredColumns.map((column) => requestBody[column]);

  // Append primary key values to the values array
  primaryKeyColumns.forEach((column) => {
    if (requestBody.hasOwnProperty(column)) {
      values.push(requestBody[column]);
    }
  });

  return {
    query: query,
    values: values,
  };
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const { error } = await schema.validate(req[source], { abortEarly: false });

      if (error) {
        const errorMessages = error.details.map((err) => ({
          field: err.context.key,
          message: err.message.replace(/['"]/g, ""), // Remove unnecessary quotes
        }));

        return res.status(400).json({ status: false, errors: errorMessages });
      }
      next();
    } catch (err) {
      storeError(err);
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  };
};
// export const textExtractor = (html) => {
//   // Load HTML content into cheerio
//   const $ = load(html);
//   // Extract text content
//   const text = $("body").text().trim(); // Get text content excluding any script/style tags
//   return text;
// };

export function generateOTP(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}

export async function sendEmail(from, to, subject, html, attachment) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, //process.env.EMAIL,
      pass: process.env.PASSWORD, //process.env.PASSWORD,
    },
  });

  // email template
  let applicantMailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: attachment?.fileName,
        path: attachment?.filePath,     
      },
    ],
  };

  try {
    // send mail with defined transport object and wait for it to complete
    const info = await transporter.sendMail(applicantMailOptions);

    // Return the response when the mail is sent successfully
    return {
      status: true,
      message: "Mail sent successfully",
    };
  } catch (error) {
    // Return an error response if the mail sending fails
    return {
      status: false,
      message: error.message,
    };
  }
}

export const generateOTPTemplate = (otp, link) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
        }
        .email-header h1 {
            font-size: 24px;
            color: #333333;
        }
        .email-content {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
            padding-bottom: 20px;
        }
        .otp {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #000;
            text-align: center;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
        .email-footer a {
            color: #888888;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Password Reset OTP</h1>
        </div>
        <div class="email-content">
            <p>Dear User,</p>
            <p>We received a request to reset your password. Please use the OTP below to proceed with resetting your password.</p>
            <p class="otp">${otp}</p>
            <p>This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="email-footer">
            <p>Best Regards,</p>
            <p><a href="#">VOLT HI</a></p>
        </div>
    </div>
</body>
</html>
`;
};

export async function exchangeCodeForAccessToken(code, secrets) {
  try {
    const params = {
      grant_type: "authorization_code",
      code,
      redirect_uri: secrets.valid_oauth_uri,
      client_id: secrets.client_id,
      client_secret: secrets.client_secret,
    };

    const response = await axios.post(LINKEDIN.ACCESS_TOKEN_URL, new URLSearchParams(params), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response;
  } catch (error) {
    return handleLinkedInError(error);
  }
}

export async function uploadMediaToLinkedIn(accessToken, linkedin_id, media_type, media) {
  const { data, mimetype } = media;

  const recipe = media_type == "image" ? LINKEDIN.LINKEDIN_IMAGE_RECIPE : LINKEDIN.LINKEDIN_VIDEO_RECIPE;

  const requestBody = {
    registerUploadRequest: {
      owner: `urn:li:person:${linkedin_id}`,
      recipes: [recipe],
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
      supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
    },
  };
  try {
    const registerMediaResponse = await axios.post(`${LINKEDIN.API_URL}/assets?action=registerUpload`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const uploadUrl =
      registerMediaResponse.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
        .uploadUrl;
    const mediaUrn = registerMediaResponse.data.value.asset;

    await axios.put(uploadUrl, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": mimetype,
        "Content-Length": data.length,
      },
    });

    return { mediaUrn };
  } catch (error) {
    return handleLinkedInError(error);
  }
}

export async function createPost(accessToken, linkedin_id, data, mediaUrn = null) {
  const { content, media_title, media_description, media_type } = data;

  const mediaCategory = media_type === "image" ? "IMAGE" : media_type === "video" ? "VIDEO" : "NONE";

  const postBody = {
    author: `urn:li:person:${linkedin_id}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: mediaCategory,
        media: mediaUrn
          ? [
            {
              status: "READY",
              description: {
                text: media_description ?? "",
              },
              media: mediaUrn,
              title: {
                text: media_title ?? "",
              },
            },
          ]
          : [],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await axios.post(`${LINKEDIN.API_URL}${LINKEDIN.LINKEDIN_UGC_ENDPOINT}`, postBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    return response;
  } catch (error) {
    return handleLinkedInError(error);
  }
}

export async function deletePost(accessToken, postUrn) {
  try {
    const deleteUrl = `${LINKEDIN.API_URL}${LINKEDIN.LINKEDIN_UGC_ENDPOINT}/${encodeURIComponent(postUrn)}`;

    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    return response;
  } catch (error) {
    return handleLinkedInError(error);
  }
}

export function handleLinkedInError(error) {
  let errorMessage = "An error occurred while creating the post.";

  if (error.response && error.response.data) {
    const errorData = error.response.data;

    // Extract the main error message
    if (errorData.message) {
      errorMessage = errorData.message; // Use the error message from the response
    } else if (errorData.errorDetails && Array.isArray(errorData.errorDetails)) {
      // If errorDetails are available, extract a summary message
      errorMessage = errorData.errorDetails.map((detail) => detail.message).join(" ");
    }

    // Handle specific error type for duplicate content
    if (
      errorData.errorDetailType === "com.linkedin.common.error.BadRequest" &&
      errorData.message.includes("duplicate")
    ) {
      errorMessage = "This content is a duplicate of an existing post.";
    }
  } else if (error.message) {
    errorMessage = error.message; // Default to the generic error message
  }

  // Return the simplified error message
  return { status: false, message: errorMessage };
}

export function getEmailBody(payload, label) {
  let body = "";

  const decodeBody = (data) => Buffer.from(data, "base64").toString("utf-8");

  const traverseParts = (parts, isDraft) => {
    for (const part of parts) {
      if (isDraft) {
        // Only text/plain for drafts
        if (part.mimeType === "text/plain" && part.body && part.body.data) {
          body += decodeBody(part.body.data);
          break; // Stop further processing as we only need text/plain
        }
      } else {
        // HTML preferred for others
        if (part.mimeType === "text/html" && part.body && part.body.data) {
          body += decodeBody(part.body.data);
          break; // Stop further processing as we prefer text/html
        }
      }
      // Handle nested parts
      if (part.parts) {
        traverseParts(part.parts, isDraft);
      }
    }
  };

  if (label === "DRAFT" || label === "SENT") {
    if (payload.body && payload.body.data && payload.mimeType === "text/plain") {
      // Single-part plain text email for draft
      body = decodeBody(payload.body.data);
    } else if (payload.parts) {
      // Multipart email for draft
      traverseParts(payload.parts, true);
    }
  } else {
    if (payload.body && payload.body.data && payload.mimeType === "text/html") {
      // Single-part HTML email for others
      body = decodeBody(payload.body.data);
    } else if (payload.parts) {
      // Multipart email for others
      traverseParts(payload.parts, false);
    }
  }

  return body;
}

export function getEmailAttachments(payload) {
  const attachments = [];
  if (payload.parts) {
    payload.parts.forEach((part) => {
      if (part.filename && part.body && part.body.attachmentId) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          attachmentId: part.body.attachmentId,
        });
      }
    });
  }
  return attachments;
}

export function createMimeMessage(messageParts, from, to, subject, cc, bcc) {
  const boundary = "XYZ-" + Math.random().toString(36).substring(2);
  let message = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n`;
  if (cc) message += `Cc: ${cc.join(", ")}\n`;
  if (bcc) message += `Bcc: ${bcc.join(", ")}\n`;
  message += `MIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="${boundary}"\n\n`;

  messageParts.forEach((part) => {
    const isAttachment = !!part.part.filename;

    // Start the MIME part
    message += `--${boundary}\n`;

    // Set the MIME type
    message += `Content-Type: ${part.part.mimeType}`;
    if (isAttachment) {
      message += `; name="${part.part.filename}"\n`;
      message += `Content-Disposition: attachment; filename="${part.part.filename}"\n`;
      message += `Content-Transfer-Encoding: base64\n\n`;
      message += `${Buffer.from(part.part.body.data).toString("base64")}\n\n`; // Base64 encode attachment
    } else {
      message += `\nContent-Transfer-Encoding: 7bit\n\n`;
      message += `${part.part.body.data}\n\n`; // Plain text body
    }
  });

  // Close the MIME message
  message += `--${boundary}--`;

  return message;
}
export async function getLongLivedAccessToken(code, accessTokenUrl, secret) {
  try {
    const shortLivedTokenResponse = await axios.get(accessTokenUrl, {
      params: {
        client_id: secret.client_id,
        client_secret: secret.client_secret,
        redirect_uri: secret.valid_oauth_uri,
        code,
      },
    });
    if (!shortLivedTokenResponse?.data) {
      throw new Error("Failed to obtain short-lived access token.");
    }
    const shortLivedToken = shortLivedTokenResponse.data.access_token;

    const response = await axios.get(accessTokenUrl, {
      params: {
        grant_type: secret.type == "meta" ? "fb_exchange_token" : "ig_exchange_token",
        client_id: secret.client_id,
        client_secret: secret.client_secret,
        fb_exchange_token: shortLivedToken,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error.response?.data || error);
    return handleLinkedInError(error);
  }
}

export const refreshAccessToken = async (oauth2Client, refreshToken) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
};

export const getOauthClient = async () => {
  try {
    const [secret] = await getSecrets("google");
    if (!secret) {
      throw new Error("google access token not found");
    }
    const oauth2Client = new google.auth.OAuth2({
      clientId: secret.client_id,
      clientSecret: secret.client_secret,
      redirectUri: secret.valid_oauth_uri,
    });

    const { access_token, refresh_token, expires_at } = secret;

    // Check if access token is expired
    const isExpired = moment().isAfter(moment(expires_at));

    if (isExpired) {
      // Refresh the access token if expired
      const refreshedTokens = await refreshAccessToken(oauth2Client, refresh_token);
      const { access_token: newAccessToken, refresh_token: newRefreshToken, expiry_date } = refreshedTokens;
      const expiresAt = moment()
        .add((expiry_date - Date.now()) / 1000, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");

      const query = `UPDATE social_media_secrets SET expires_at = '${expiresAt}', access_token = '${newAccessToken}'  WHERE type = 'google'`;
      await db.query(query);
      oauth2Client.setCredentials({
        access_token: newAccessToken,
        refresh_token: newRefreshToken || refresh_token,
      });
    } else {
      oauth2Client.setCredentials({
        access_token,
        refresh_token,
      });
    }

    return oauth2Client;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to setup OAuth client");
  }
};

export const getUserTweets = async (client, userId, maxResults = 10, paginationToken = null) => {
  try {
    const params = { max_results: maxResults };
    if (paginationToken) params.pagination_token = paginationToken;

    const response = await client.v2.userTimeline(userId, params);
    return {
      tweets: response.data.data || [],
      meta: response.data.meta || {}, // Meta contains next_token, result_count, etc.
    };
  } catch (error) {
    throw new Error(`Failed to fetch tweets: ${error.message}`);
  }
};

export async function uploadMediaToTwitter(mediaFile, oauthToken) {
  try {
    const mediaUrl = "https://upload.twitter.com/1.1/media/upload.json";

    // Read the media file content as a buffer
    const mediaData = fs.readFileSync(mediaFile.path);

    // Set up the request headers and body
    const headers = {
      Authorization: `OAuth oauth_consumer_key="${process.env.API_KEY}", oauth_token="${oauthToken}", oauth_signature_method="HMAC-SHA1", oauth_version="1.0"`,
      "Content-Type": "application/json",
    };

    // Prepare the request data to upload the media
    const data = {
      media: mediaData,
    };

    // Send the media upload request to Twitter
    const response = await axios.post(mediaUrl, data, { headers });
    console.log("response: ", response.data);

    // Return the media_id from the response
    return response.data.media_id_string;
  } catch (error) {
    throw new Error("Error uploading media: " + error.response.data || error.message);
  }
}

export const getRedirectUrl = (baseUrl, type) => {
  try {
    switch (type) {
      case "meta":
        return `${baseUrl}/meta/auth/meta/callback/`;
      case "twitter":
        return `${baseUrl}/twitter/auth/twitter/callback`;

      case "linkedin":
        return `${baseUrl}/linkedin/auth/linkedin/callback`;
      case "google":
        return `${baseUrl}/google/auth/google/callback`;
      default:
        throw new Error("Invalid type");
    }
  } catch (error) {
    throw error;
  }
};

export function generateReplyEmail(type, userName, userMessage, response) {
  let greeting = `Dear <strong>${userName}</strong>,`;
  let intro;
  let messageBlock;

  if (type === "query") {
    intro = `Thank you for reaching out to us. We have received your query:`;
    messageBlock = `
      <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #0078D4;">
        "${userMessage}"
      </blockquote>
      <p>Here is our response:</p>
      <p><strong>${response}</strong></p>
    `;
  } else if (type === "contact") {
    intro = `Thank you for contacting us. Here is our response to your message:`;
    messageBlock = `
      <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #0078D4;">
        "${userMessage}"
      </blockquote>
      <p><strong>${response}</strong></p>
    `;
  } else {
    intro = `Thank you for getting in touch with us.`;
    messageBlock = `<p><strong>${response}</strong></p>`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #0078D4;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
          color: #333333;
        }
        .content p {
          margin: 0 0 15px;
        }
        .footer {
          background-color: #f4f4f4;
          color: #888888;
          padding: 10px 20px;
          text-align: center;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #0078D4;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          ${type === "query" ? "Reply to Your Query" : "Contact Us Response"}
        </div>
        <div class="content">
          <p>${greeting}</p>
          <p>${intro}</p>
          ${messageBlock}
          <p>If you have any further questions, feel free to reply to this email.</p>
          <a href="mailto:volthi@support.com" class="button">Contact Us</a>
        </div>
        <div class="footer">
          &copy; 2024 VoltHi. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateDonationEmail(userName, amount) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #28a745;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
          color: #333333;
        }
        .content p {
          margin: 0 0 15px;
        }
        .footer {
          background-color: #f4f4f4;
          color: #888888;
          padding: 10px 20px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          Thank You for Your Donation!
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We sincerely appreciate your generous donation of <strong>₹${amount}</strong>. Your support helps us continue our mission.</p>
          <p>Please find the attached invoice for your records.</p>
          <p>Thank you for making a difference!</p>
        </div>
        <div class="footer">
          &copy; 2024 VoltHi. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateInvoice(data) {
  return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
      const sanitizedUserName = data.full_name.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `invoice_${sanitizedUserName}_${timestamp}.pdf`;
      const filePath = path.join(process.cwd(), "public", "invoice", fileName);

      if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Title
      doc.fontSize(20).text('Donation Invoice', { align: 'center' }).moveDown(2);

      // Define table data dynamically
      const tableData = [];
      const fields = {
          "Full Name": data?.full_name,
          "Email": data?.email,
          "Mobile": data?.mobile,
          "Aadhar Number": data?.aadhar_number,
          "PAN Number": data?.pan_number,
          "Donation Amount": `Rs. ${data?.donation_amount}`,
          "Address": data?.address,
          "Donation Type": data?.donation_type,
          "Anonymous": data?.anonymous === "1" ? "Yes" : "No",
          // "Aadhar URL": data?.aadhar_url,
          // "PAN URL": data?.pan_url
      };

      // Push only available fields to tableData
      Object.entries(fields).forEach(([key, value]) => {
          if (value) {
              tableData.push([key, value]);
          }
      });

      // Function to draw a table without headers
      function drawTable(doc, startX, startY, tableData) {
          const columnWidths = [200, 300]; // Define column widths
          let y = startY;

          doc.fontSize(12).font("Helvetica");
          tableData.forEach((row) => {
              let x = startX;

              row.forEach((cell, cellIndex) => {
                  doc.rect(x, y, columnWidths[cellIndex], 25).stroke();
                  doc.text(cell, x + 5, y + 7, { width: columnWidths[cellIndex] - 10 });
                  x += columnWidths[cellIndex];
              });

              y += 25;
          });

          return y;
      }

      const tableStartY = doc.y;
      drawTable(doc, 50, tableStartY, tableData);

      doc.moveDown(2);
      doc.fontSize(14).text('Thank you for your generous donation!', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve({ filePath, fileName }));
      stream.on('error', reject);
  });
}

export function convertToUnixTimestamp(dateStr) {
  return moment.utc(dateStr, "YYYY-MM-DD HH:mm:ss").unix();
}

// facebook utils

export async function postContentOnFacebook(pageId, accessToken, data) {
  const url = `${META.GRAPH_API}/${pageId}/feed`;
  // if (mappedData?.published === false) {
  //   mappedData.scheduled_publish_time = convertToUnixTimestamp(mappedData.publish_time);
  //   delete mappedData.publish_time;
  // }
  let mappedData = {
    message: data.content,
  };
  try {
    const response = await axios.post(url, {
      ...mappedData,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting to Facebook page:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export async function postImageOnFB(pageId, pageAccessToken, content = "", imageBuffer) {
  try {
    const form = new FormData();
    form.append("source", imageBuffer, { filename: "image.jpg" });
    form.append("access_token", pageAccessToken);

    if (content) {
      form.append("message", content);
    }
    const response = await axios.post(`${META.GRAPH_API}/${pageId}/photos`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting image:", error.response?.data || error.message);
    throw new Error(error.response?.data.error.message || "Failed to post image.");
  }
}

export async function getFacebookPages(accessToken) {
  const url = `${META.GRAPH_API}/me/accounts`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        fields: "id,name,instagram_business_account,access_token,tasks,category_list",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pages:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function getPosts(pageId, accessToken) {
  const url = `${META.GRAPH_API}/${pageId}/feed`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        fields: "id,message,created_time,attachments",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function deleteFBPost(postId, accessToken) {
  try {
    const response = await axios.delete(`${META.GRAPH_API}/${postId}`, {
      params: {
        access_token: accessToken, // Add the access token as a query parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function updateFBPost(postId, accessToken, data) {
  try {
    const response = await axios.post(`${META.GRAPH_API}/${postId}`, {
      message: data.content,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function uploadVideoToFB(pageId, accessToken, data, videoBuffer) {
  try {
    const form = new FormData();
    form.append("access_token", accessToken);
    form.append("message", data?.content || "");
    form.append("title", data?.title || "");
    form.append("source", videoBuffer);

    // Send POST request to upload the video
    const response = await axios.post(`${META.GRAPH_API}/${pageId}/videos`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const getPageRatings = async (pageId, accessToken) => {
  try {
    const response = await axios.get(`${META.GRAPH_API}/${pageId}/ratings`, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error.response?.data || error.message);
    throw error;
  }
};

export async function getPageInsights(pageId, accessToken, metrics) {
  try {
    const structuredData = {};

    const metricsToExtract = {
      total_visitors: { metric: "page_views_total", period: "days_28" },
      active_visitors: { metric: "page_impressions_unique", period: "day" },
      likes: { metric: "page_fans", period: "day" },
      shares: { metric: "page_post_engagements", period: "days_28" },
      new_followers: { metric: "page_follows", period: "days_28" },
      unfollows: { metric: "page_daily_unfollows_unique", period: "days_28" },
    };
    const response = await axios.get(`${META.GRAPH_API}/${pageId}/insights`, {
      params: {
        access_token: accessToken,
        metric: metrics.join(","),
      },
    });

    for (const key in metricsToExtract) {
      const { metric, period } = metricsToExtract[key];

      // Find the matching data for the metric and period
      const filtered = response.data.data.find((item) => item.name === metric && item.period === period);

      if (filtered && filtered.values.length > 0) {
        // Extract the latest value
        const latestValue = filtered.values[filtered.values.length - 1].value;

        structuredData[key] = {
          metric,
          period,
          value: latestValue,
        };
      }
    }

    return structuredData;
  } catch (error) {
    console.error("Error fetching insights:", error.response?.data || error.message);
    throw new Error("Failed to fetch page insights.");
  }
}

export const createMediaContainer = async (accessToken, ID, media_type, mediaPaths, caption, scheduled_time) => {
  if (scheduled_time) {
    scheduled_time = convertToUnixTimestamp(scheduled_time);
  }

  let requestBody = {
    caption,
    access_token: accessToken,
  };

  if (scheduled_time) {
    requestBody.scheduled_publish_time = scheduled_time;
  }
  try {
    if (media_type === "image") {
      requestBody.image_url = mediaPaths[0];
    } else if (media_type === "video") {
      requestBody.video_url = mediaPaths[0];
      requestBody.media_type = "REELS";
    } else if (media_type === "carousel") {
      const childMediaIds = [];
      for (const mediaUrl of mediaPaths) {
        const response = await axios.post(`${META.GRAPH_API}/${ID}/media`, {
          image_url: mediaUrl,
          is_carousel_item: true,
          access_token: accessToken,
        });
        childMediaIds.push(response.data.id);
      }

      // Create a carousel container
      requestBody.media_type = "CAROUSEL";
      requestBody.children = childMediaIds;
    } else {
      throw new Error("Unsupported media type");
    }
    const response = await axios.post(`${META.GRAPH_API}/${ID}/media`, requestBody);
    return response.data.id;
  } catch (error) {
    console.error("Error creating media container:", error.response?.data || error.message);
    throw error.response?.data.error || error.message;
  }
};

export const publishMediaContainer = async (accessToken, ID, creationId) => {
  try {
    let isMediaReady = false;
    let attempts = 0;

    while (!isMediaReady && attempts < 5) {
      isMediaReady = await checkMediaStatus(accessToken, ID, creationId);
      if (!isMediaReady) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      attempts++;
    }

    if (!isMediaReady) {
      throw new Error("Media is not ready after multiple attempts");
    }

    const response = await axios.post(`${META.GRAPH_API}/${ID}/media_publish`, {
      creation_id: creationId,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error publishing media container:", error.response?.data || error.message);
    throw error.response?.data.error || error.message;
  }
};

export const checkMediaStatus = async (accessToken, instagramBusinessAccountId, creationId) => {
  try {
    const response = await axios.get(`${META.GRAPH_API}/${creationId}`, {
      params: {
        fields: "id,status,status_code",
        access_token: accessToken,
      },
    });
    const mediaStatus = response.data.status_code;
    // Media is ready when status is 'FINISHED'
    return mediaStatus === "FINISHED";
  } catch (error) {
    console.error("Error checking media status:", error.message);
    throw error;
  }
};

export const getInstagramProfile = async (accessToken, instagramAccountId) => {
  try {
    const fields =
      "id,username,name,biography,website,profile_picture_url,followers_count,follows_count,media_count,ig_id";
    const response = await axios.get(`${META.GRAPH_API}/${instagramAccountId}`, {
      params: {
        fields,
        access_token: accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getAllMedias = async (accessToken, instagramAccountId) => {
  try {
    const fields =
      "id,caption,media_type,media_url,permalink,thumbnail_url,comments_count,like_count,media_product_type,owner,shortcode,username,boost_eligibility_info,timestamp";
    const response = await axios.get(`${META.GRAPH_API}/${instagramAccountId}/media`, {
      params: {
        fields,
        access_token: accessToken,
      },
    });

    const result = response.data;
    result.data.forEach((media) => {
      media.timestamp = moment(media.timestamp).format("MMMM D, YYYY, h:mm A");
    });

    return result;
  } catch (error) {
    console.error("Error getting all media:", error.response?.data || error.message);
    throw error;
  }
};
export const getStories = async (accessToken, instagramAccountId) => {
  try {
    const fields = "id,media_type,media_url,thumbnail_url,timestamp";
    const response = await axios.get(`${META.GRAPH_API}/${instagramAccountId}/stories`, {
      params: {
        fields,
        access_token: accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting stories:", error.response?.data || error.message);
    throw error;
  }
};
export const getCommentsForMedia = async (accessToken, mediaId) => {
  try {
    const fields = "id,text,username,timestamp";
    const response = await axios.get(`${META.GRAPH_API}/${mediaId}/comments`, {
      params: {
        fields,
        access_token: accessToken,
      },
    });
    const result = response.data.data;
    result.forEach((comment) => {
      comment.timestamp = moment(comment.timestamp).format("MMMM D, YYYY, h:mm A");
    });
    return result;
  } catch (error) {
    console.error("Error getting stories:", error.response?.data || error.message);
    throw error;
  }
};

export const getRepliesOnComment = async (accessToken, commentId) => {
  try {
    const url = `${META.GRAPH_API}/${commentId}/replies`;
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        fields: "id,text,username,timestamp",
      },
    });
    const result = response.data.data;
    result.forEach((comment) => {
      comment.timestamp = moment(comment.timestamp).format("MMMM D, YYYY, h:mm A");
    });
    return result;
  } catch (error) {
    console.error("Error fetching replies:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const replyToComment = async (accessToken, commentId, message) => {
  try {
    const url = `${META.GRAPH_API}/${commentId}/replies`;
    const response = await axios.post(url, {
      message: message,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteComment = async (accessToken, commentId) => {
  try {
    const url = `${META.GRAPH_API}/${commentId}`;
    const response = await axios.delete(url, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getDetailsOfComment = async (accessToken, commentId) => {
  try {
    const url = `${META.GRAPH_API}/${commentId}`;
    const response = await axios.get(url, {
      params: {
        fields: "id, from, hidden, like_count,media, parent_id, replies, text, timestamp, username",
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const mapInsights = (insights) => {
  const insightMap = {
    impressions: "Total Impressions",
    reach: "Total Reach",
    engagement: "Total Engagement",
    profile_views: "Profile Views",
    audience_count: "Audience Count",
    carousel_album_engagement: "Carousel Album Engagement",
    carousel_album_impressions: "Carousel Album Impressions",
    carousel_album_reach: "Carousel Album Reach",
    plays: "Video Plays",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    saves: "Saves",
    replies: "Replies",
    follows_and_unfollows: "Follows and Unfollows",
    website_clicks: "Website Clicks",
  };
  return insights.data.map((item) => ({
    metric: insightMap[item.name] || item.name,
    period: item.period || "total",
    value: item.total_value ? item.total_value.value : item.values[0].value,
    description: item.description,
  }));
};
export const getMediaInsights = async (accessToken, mediaId) => {
  try {
    const metrics =
      "impressions, reach,  saved,  likes, comments, shares,  total_interactions, follows, profile_visits, profile_activity";
    const response = await axios.get(`${META.GRAPH_API}/${mediaId}/insights`, {
      params: {
        metric: metrics,
        access_token: accessToken,
        period: "day",
        // metric_type: "total_value",
      },
    });
    response.data.data = mapInsights(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting stories:", error.response?.data || error.message);
    throw error;
  }
};
export const getAccountInsights = async (
  accessToken,
  instagramAccountId,
  period = "day",
  metricType = "total_value",
  breakdown = "",
  since = null,
  until = null,
  timeframe = null
) => {
  try {
    const metrics = [
      "impressions",
      "reach",
      "likes",
      "comments",
      "shares",
      // "saves",
      // "replies",
      "follows_and_unfollows",
      // "profile_views",
      // "website_clicks",
    ];
    // follower_count and online_followers metrics are not available on IG Users with fewer than 100 followers.
    const params = {
      metric: metrics.join(","),
      period,
      metric_type: metricType,
      access_token: accessToken,
    };

    // Add breakdown if provided
    if (breakdown) {
      params.breakdown = breakdown;
    }

    // Add timeframe for demographic metrics if needed
    if (timeframe) {
      params.timeframe = timeframe;
    }

    // Add date range (since and until)
    if (since && until) {
      params.since = since;
      params.until = until;
    }

    // Make API request
    const response = await axios.get(`${META.GRAPH_API}/${instagramAccountId}/insights`, { params });
    // Handle the response and return insights
    const result = mapInsights(response.data);
    return result;
  } catch (error) {
    console.error("Error getting stories:", error.response?.data || error.message);
    throw error;
  }
};

export const saveMetaData = async (data) => {
  try {
    const { id } = data;
    if (id) {
      const { query, values } = updateQueryBuilder(Post, data);
      await db.query(query, values);
    } else {
      const { query, values } = createQueryBuilder(Post, data);
      await db.query(query, values);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const getRolePermission = async (roleId) => {
  const excludedModules = ["Settings", "Roles & Permissions", "User Management"];
  let modules = await db.query("SELECT * FROM module");

  if (roleId != 1) {
    modules = modules.filter((module) => !excludedModules.includes(module.name));
  }

  const role = await db.query("SELECT * FROM roles WHERE id = ?", [roleId]);
  if (role.length === 0) {
    throw new Error("Role not found");
  }

  const permissions = await db.query("SELECT * FROM permission WHERE role_id = ?", [roleId]);

  const permissionsMap = {};
  permissions.forEach((permission) => {
    permissionsMap[permission.module_id] = {
      create: permission.create,
      read: permission.read,
      update: permission.update,
      delete: permission.delete,
    };
  });

  const moduleMap = {};
  modules.forEach((module) => {
    // Add permissions or default values
    const modulePermissions = permissionsMap[module.id] || {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
    };

    moduleMap[module.id] = {
      module_id: module.id,
      parent_id: module.parent_id,
      name: module.name,
      path: module.path,
      icon: module.icon,
      ...modulePermissions,
      children: [],
    };
  });

  const hierarchy = [];
  Object.values(moduleMap).forEach((module) => {
    if (module.parent_id) {
      // If the module has a parent, add it to the parent's `children` array
      if (moduleMap[module.parent_id]) {
        moduleMap[module.parent_id].children.push(module);
      }
    } else {
      // If the module has no parent, add it to the root level
      hierarchy.push(module);
    }
  });
  return hierarchy;
};

export const saveRedirectUri = async (req, res, next) => {
  try {
    const protocolHeaders = req.headers["x-forwarded-proto"] || req.protocol;
    const protocol = protocolHeaders.split(",")[0];
    const host = req.headers["x-forwarded-host"] || req.get("host");
    const baseUrl = `${protocol}://${host}/api`;

    let data = {};
    for (let key in SOCIAL_MEDIA) {
      const [secret] = await getSecrets(SOCIAL_MEDIA[key]);

      // if (secret?.valid_oauth_uri.split(`/${SOCIAL_MEDIA[key]}`)[0] === baseUrl) {
      //   return next();
      // }
      const valid_oauth_uri = getRedirectUrl(baseUrl, SOCIAL_MEDIA[key]);
      data.valid_oauth_uri = valid_oauth_uri;
      data.type = SOCIAL_MEDIA[key];
      if (secret) {
        await saveSecrets(data, secret.id);
      } else {
        await saveSecrets(data);
      }
    }
    next();
  } catch (error) {
    storeError(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const checkUserExists = async (aadhar_number, pan_number) => {
  let query = `SELECT id FROM users WHERE `;
  let conditions = [];
  let values = [];

  if (aadhar_number) {
    conditions.push("aadhar_number = ?");
    values.push(aadhar_number);
  }

  if (pan_number) {
    conditions.push("pan_number = ?");
    values.push(pan_number);
  }

  query += conditions.join(" OR ");

  const [result] = await db.query(query, values);
  return result?.id ? result.id : null;
};

export const getAdminData = async () => {
  try {
    const fetchUserQuery = `SELECT id, full_name, email, mobile, asset FROM users WHERE id = 1`;
    const fetchDetail = await db.query(fetchUserQuery);
    return fetchDetail[0];
  } catch (error) {
    storeError(error);
    throw new Error("Admin not found");
  }
};

export const createNotification = async (data) => {
  try {
    const { user_id, message } = data;

    if (!user_id || !message) {
      throw new Error("User ID, and message are required");
    }

    const { query, values } = createQueryBuilder(Notification, data);
    await db.query(query, values);

    return "Notification created successfully";
  } catch (error) {
    storeError(error);
    throw new Error("Admin not found");
  }
};