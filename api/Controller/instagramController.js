import axios from "axios";
import asyncHandler from "express-async-handler";
import moment from "moment";
import fs from "fs";
import path from "path";
import {
  createMediaContainer,
  deleteComment,
  deleteFilesInFolder,
  getAccountInsights,
  getAllMedias,
  getCommentsForMedia,
  getDetailsOfComment,
  getInstagramProfile,
  getLongLivedAccessToken,
  getMediaInsights,
  getRepliesOnComment,
  getStories,
  publishMediaContainer,
  replyToComment,
  saveMetaData,
  storeError,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import { getSecrets } from "./socialMediaSecretController.js";
import { META, SOCIAL_MEDIA } from "../helper/constants.js";

const db = makeDb();

export const getInstagramPosts = asyncHandler(async (req, res) => {
  try {
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    storeError(error);
    console.log(error.response.data);
    res.status(500).json({ status: false, error: error.message });
  }
});

export const postInstagram = asyncHandler(async (req, res, next) => {
  try {
    const { media_type, content, scheduled_time, type } = req.body;
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, instagram_business_account_id } = secret;
    if (type.includes("instagram") == false) {
      console.log("instagram");
      return next();
    }

    // Handle single or multiple file uploads
    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    const files = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
    const uploadedPaths = [];

    files.forEach((file) => {
      const fileName = Date.now() + "-" + file.name;
      const uploadPath = path.join(uploadsDir, fileName);
      file.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
      });
      uploadedPaths.push("/uploads/" + fileName);
    });

    const mediaUrls = uploadedPaths.map((filePath) => `${req.protocol}://${req.get("host")}${filePath}`);

    const creationId = await createMediaContainer(
      accessToken,
      instagram_business_account_id,
      media_type,
      mediaUrls,
      content,
      scheduled_time
    );
    console.log("creationId: ", creationId);

    let result;
    if (!scheduled_time) {
      result = await publishMediaContainer(accessToken, instagram_business_account_id, creationId);
    }

    const query = `SELECT * FROM post WHERE media = ? AND content = ?`;
    const queryResult = await db.query(query, [req.body.media, req.body.content]);
    console.log("queryResult: Instagram ", queryResult);
    let postData = {};
    if (queryResult.length > 0) {
      const type = JSON.parse(queryResult[0].type);
      type.push("Instagram");
      postData.type = JSON.stringify(type);
      postData.id = queryResult[0].id;
      await saveMetaData(postData);
    } else {
      postData.type = JSON.stringify(["Instagram"]);
      postData.media = uploadedPaths[0];
      postData.content = req.body.content;
      postData.media_type = media_type;
      await saveMetaData(postData);
    }
    return next();

    // res
    //   .status(200)
    //   .json({ success: true, data: result ? result : "'Post scheduled to be published at: " + scheduled_time + "'" });
  } catch (error) {
    console.error("Error creating Instagram post:", error);
    res.status(500).json({ status: false, message: error.response?.data?.error?.message || error.message });
  }
});

export const getInstaProfile = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, instagram_business_account_id } = secret;
    const response = await getInstagramProfile(accessToken, instagram_business_account_id);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});

export const getInstaMedias = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, instagram_business_account_id } = secret;
    const response = await getAllMedias(accessToken, instagram_business_account_id);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});

export const getInstaStories = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, instagram_business_account_id } = secret;
    const response = await getStories(accessToken, instagram_business_account_id);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});

export const getCommentsOnMedia = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { mediaId } = req.params;
    const { page_access_token: accessToken } = secret;
    const response = await getCommentsForMedia(accessToken, mediaId);
    if (response.length === 0) return res.status(404).json({ status: false, message: "No Comment found" });

    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
export const getReplyOnComment = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { commentId } = req.params;
    const { page_access_token: accessToken } = secret;
    const response = await getRepliesOnComment(accessToken, commentId);
    if (response.length === 0) return res.status(404).json({ status: false, message: "No replies found" });
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});

export const replyToAComment = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { comment_id, message } = req.body;
    const { page_access_token: accessToken } = secret;
    const response = await replyToComment(accessToken, comment_id, message);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
export const deleteAComment = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { commentId } = req.params;
    const { page_access_token: accessToken } = secret;
    const response = await deleteComment(accessToken, commentId);
    if (response.success) {
      return res.status(200).json({ status: true, message: "Comment deleted successfully" });
    }
    return res.status(500).json({ status: false, message: "Failed to delete comment" });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
export const getCommentDetails = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { commentId } = req.params;
    const { page_access_token: accessToken } = secret;
    const response = await getDetailsOfComment(accessToken, commentId);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
export const getInstaAccountInsights = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, instagram_business_account_id } = secret;
    const response = await getAccountInsights(accessToken, instagram_business_account_id);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
export const getInstaMediaInsights = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { mediaId } = req.params;
    const { page_access_token: accessToken } = secret;
    const response = await getMediaInsights(accessToken, mediaId);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});
