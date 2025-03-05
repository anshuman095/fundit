import axios from "axios";
import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import moment from "moment";
import {
  createPost,
  createQueryBuilder,
  deleteFile,
  deletePost,
  exchangeCodeForAccessToken,
  saveMetaData,
  storeError,
  updateQueryBuilder,
  uploadFile,
  uploadMediaToLinkedIn,
} from "../helper/general.js";
import LinkedinPosts from "../sequelize/linkedinPostsSchema.js";
import { LINKEDIN, SOCIAL_MEDIA } from "../helper/constants.js";
import { getSecrets } from "./socialMediaSecretController.js";

const db = makeDb();

export const handleLinkedInCallback = asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ status: false, error: "Code not found" });
    }
    const [secrets] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
    const response = await exchangeCodeForAccessToken(code, secrets);
    const { access_token, expires_in } = response.data;

    await saveAccessToken(secrets.id, access_token, expires_in);

    // return res.json({ status: true, access_token });
    res.redirect(`${process.env.FRONTEND_URI}?tab=linkedin`);
  } catch (error) {
    console.error("Error exchanging LinkedIn code for access token:", error);
    return res.status(500).json({ status: false, error: "Failed to get access token" });
  }
});

// Function to save or update LinkedIn access token in the database
async function saveAccessToken(id, accessToken, expires_in) {
  try {
    const userInfo = await getLinkedinUserInfo(accessToken);
    const expirationTimestamp = moment().add(expires_in, "seconds").format("YYYY-MM-DD HH:mm:ss");
    const sqlUpdate = `UPDATE social_media_secrets SET access_token = ?, expires_at = ?, social_media_id = ? WHERE id = ?`;
    await db.query(sqlUpdate, [accessToken, expirationTimestamp, userInfo.sub, id]);
  } catch (error) {
    console.error("Error saving LinkedIn access token:", error);
    throw error;
  }
}

async function getLinkedinUserInfo(accessToken) {
  try {
    const response = await axios.get(LINKEDIN.PROFILE_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
    return response.data;
  } catch (error) {
    console.error("Error retrieving user profile", error);
    return res.status(500).json({ status: false, error: error.message });
  }
}

export const checkLinkedInAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);

    if (!secret || !secret?.access_token) {
      return res.status(401).json({ status: false, error: "LinkedIn access token not found" });
    }

    const currentTime = moment();
    const expirationTime = moment(secret.expires_at);

    // Check if the token has expired
    if (currentTime.isAfter(expirationTime)) {
      return res.status(401).json({
        status: false,
        error: "LinkedIn access token has expired, please renew the token.",
      });
    }

    next();
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const createUpdateLinkedInPost = asyncHandler(async (req, res, next) => {
  try {
    const type = JSON.parse(req.body.type);
    req.body.type = type;
    if (type.length == 0) {
      throw new Error("Type is required");
    }
    if (type.includes("linkedin") == false) {
      console.log("linkedin");
      return next();
    }

    const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
    const { access_token, social_media_id: linkedin_id } = secret;
    let mediaUrn;

    let media_type = "";

    // Upload Media to LinkedIn
    if (req.files && req.files.media) {
      const { mimetype } = req.files.media;
      if (mimetype.startsWith("image/")) {
        media_type = "image";
      } else if (mimetype.startsWith("video/")) {
        media_type = "video";
      }
      req.body.media_type = media_type;
      const uploadResponse = await uploadMediaToLinkedIn(access_token, linkedin_id, media_type, req.files.media);
      req.body.media = await uploadFile("social_post", req.files.media);
      mediaUrn = uploadResponse.mediaUrn;
    }

    //  Create Post on LinkedIn
    const postResponse = await createPost(access_token, linkedin_id, req.body, mediaUrn);

    // Save post data to database if successful
    if (!postResponse?.data) {
      return res.status(400).json({ status: false, error: postResponse.message.split(": ")[1] });
    }

    const postData = {
      type: JSON.stringify(["Linkedin"]),
      media: req.body.media,
      media_type: media_type,
      content: req.body.content,
    };
    await saveMetaData(postData);
    // req.body.post_id = postResponse.data.id;
    // req.body.linkedin_id = linkedin_id;
    // const response = await deletePost(access_token, post[0].post_id);
    // if (response.status == 204) {
    //   const result = deleteFile(post[0].media);
    // }

    next();
    // return res.status(201).json({ status: true, message: "Post processed successfully" });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.response?.data || error.message });
  }
});

// Function to delete a LinkedIn post
export const deleteLinkedInPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
    const { access_token, linkedin_id } = secret;
    const query = `SELECT * FROM linkedin_posts WHERE id = ${id}`;
    const post = await db.query(query);
    if (post.length == 0) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }
    // Use LinkedIn API to delete the post
    const response = await deletePost(access_token, post[0].post_id);
    if (response.status == 204) {
      // Delete post data from database if successful
      const sql = `UPDATE linkedin_posts SET deleted = 1 WHERE id=? AND linkedin_id=?`;
      await db.query(sql, [id, linkedin_id]);
      return res.status(200).json({ status: true, message: "Post deleted successfully" });
    }
    res.status(500).json({ status: false, message: "something went wrong" });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const getLinkedInPosts = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    let whereCondition = "";
    if (id) {
      whereCondition = `AND id = ${id}`;
    }

    const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
    const { linkedin_id } = secret;
    const query = `SELECT * FROM linkedin_posts WHERE linkedin_id = ? AND deleted = 0 ${whereCondition}`;
    const result = await db.query(query, [linkedin_id]);

    if (result.length == 0) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    return res.status(200).json({ status: true, data: id ? result[0] : result });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const likePost = asyncHandler(async (req, res, next) => {
  try {
    const { access_token, linkedin_id } = req.tokens;
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});

export const getPosts = asyncHandler(async (req, res) => {
  const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
  const { access_token, linkedin_id } = secret;

  const url = `${LINKEDIN.API_URL}${LINKEDIN.LINKEDIN_UGC_ENDPOINT}?q=authors&authors=urn:li:person:${linkedin_id}`;
  console.log("url: ", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.status(200).json({ status: true, data: response.data });
  } catch (error) {
    storeError(error);
    res.status(500).json({ status: false, error: error.response?.data || error.message });
  }
});
