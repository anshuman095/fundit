import axios from "axios";
import moment from "moment";
import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import {
  convertToUnixTimestamp,
  deleteFBPost,
  getFacebookPages,
  getLongLivedAccessToken,
  getPageInsights,
  getPageRatings,
  getPosts,
  getRedirectUrl,
  postContentOnFacebook,
  postImageOnFB,
  saveMetaData,
  storeError,
  updateFBPost,
  uploadFile,
  uploadVideoToFB,
} from "../helper/general.js";
import { META, SOCIAL_MEDIA } from "../helper/constants.js";
import { getSecrets, saveSecrets } from "./socialMediaSecretController.js";

const db = makeDb();

// Function to initiate Facebook login
export const handleFacebookLogin = asyncHandler(async (req, res) => {
  const [secret] = await getSecrets(SOCIAL_MEDIA.META);
  const params = {
    response_type: "code",
    client_id: req.body.client_id,
    redirect_uri: secret.valid_oauth_uri,
    state: Buffer.from(Math.round(Math.random() * Date.now()).toString()).toString("hex"),
    scope: META.SCOPES,
  };
  const authorizeUrlWithParams = `${META.AUTHORIZE_URL}?${new URLSearchParams(params)}`;

  saveSecrets(req.body, secret.id);
  res.status(200).json({ status: true, redirectUrl: authorizeUrlWithParams });
});

// Function to handle Facebook OAuth callback (redirect URI)
export const handleFacebookRedirect = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const [secrets] = await getSecrets(SOCIAL_MEDIA.META);

  const accessTokenUrl = `${META.GRAPH_API}/oauth/access_token`;

  const data = await getLongLivedAccessToken(code, accessTokenUrl, secrets);

  const { access_token, expires_in } = data;
  const pagesInfo = await getFacebookPages(access_token);
  const mappedData = {
    access_token,
    page_access_token: pagesInfo.data[0].access_token,
    social_media_id: pagesInfo.data[0].id,
    instagram_business_account_id: pagesInfo.data[0]?.instagram_business_account?.id,
  };
  if (expires_in) {
    const expires_at = moment().add(expires_in, "seconds").format("YYYY-MM-DD HH:mm:ss");
    mappedData.expires_at = expires_at;
  }

  await saveSecrets(mappedData, secrets.id);

  res.redirect(`${process.env.FRONTEND_URI}?tab=meta`);
});

export const getFacebookAccounts = asyncHandler(async (req, res, next) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);

    const fbAccounts = await getFacebookPages(secret.access_token);
    const { access_token, ...data } = fbAccounts.data[0];
    res.status(200).json({ status: true, data: data });
  } catch (error) {
    storeError(error);
    res.status(500).json({ status: false, error: error.message });
  }
});

export async function checkFacebookAccessToken(req, res, next) {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);

    if (!secret || !secret?.access_token) {
      return res.status(401).json({ status: false, error: "Facebook access token not found" });
    }

    const currentTime = moment();
    const expirationTime = moment(secret.expires_at);

    // Check if the token has expired
    if (currentTime.isAfter(expirationTime)) {
      return res.status(401).json({
        status: false,
        error: "Facebook access token has expired, please renew the token.",
      });
    }
    req.tokens = {
      access_token: secret.access_token,
    };
    next();
  } catch (error) {
    storeError(error);
    res.status(500).json({ status: false, error: error.message });
  }
}

// Function to create a Facebook post
export const createFacebookPost = asyncHandler(async (req, res, next) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;
    const media = req.files && req.files.media;
    const { content, type, media_type } = req.body;

    if (type.includes("facebook") == false) {
      console.log("facebook");
      return next();
    }
    let response;
    if (media) {
      if (media_type == "image") {
        req.body.media = await uploadFile("social_post", req.files.media);
        response = await postImageOnFB(pageId, accessToken, content, media.data);
      } else {
        response = await uploadVideoToFB(pageId, accessToken, req.body, media.data);
      }
    } else {
      response = await postContentOnFacebook(pageId, accessToken, req.body);
    }
    const facebookPostId = response?.id;

    const query = `SELECT * FROM post WHERE media = ? AND content = ?`;
    const result = await db.query(query, [req.body.media, req.body.content]);
    console.log("result: facebook ", result);
    let postData = {};
    if (result.length > 0) {
      const type = JSON.parse(result[0].type);
      type.push("Facebook");
      postData.type = JSON.stringify(type);
      postData.id = result[0].id;
      let existingIds = JSON.parse(result[0].social_media_ids || "[]");
      existingIds.push({ id: facebookPostId, type: "Facebook" });
      postData.social_media_ids = JSON.stringify(existingIds);
      await saveMetaData(postData);
    } else {
      postData.type = JSON.stringify(["Facebook"]);
      postData.media = req.body.media;
      postData.content = req.body.content;
      postData.media_type = media_type;
      postData.social_media_ids = JSON.stringify([{ id: facebookPostId, type: "Facebook" }]);
      await saveMetaData(postData);
    }

    next();
    // res.status(201).json({ status: true, data: response });
  } catch (error) {
    console.error("Error creating Facebook post:", error.message);
    res.status(500).json({ status: false, error: error.response?.data?.error?.message || error.message });
  }
});

export const postImageOnFacebook = asyncHandler(async (req, res, next) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;
    if (req.files) {
      const response = await postImageOnFB(pageId, accessToken, "", req.files.media.data);
      res.status(201).json({ status: true, data: response });
    }
  } catch (error) {
    console.error("Error creating Facebook post:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

export const getFacebookPosts = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;

    const response = await getPosts(pageId, accessToken);
    res.status(200).json({ status: true, data: response.data });
  } catch (error) {
    console.error("Error creating Facebook post:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// Function to update a Facebook post
export const updateFacebookPost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;

    // Use Facebook API to update the post
    // const response = await axios.post(
    //   `${FACEBOOK_API_URL}/${postId}`,
    //   {
    //     message,
    //   },
    //   {
    //     params: {
    //       access_token: accessToken,
    //     },
    //   }
    // );

    const response = await updateFBPost(postId, accessToken, req.body);

    res.json({ status: true, data: response.data });
  } catch (error) {
    console.error("Error updating Facebook post:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// Function to delete a Facebook post
export const deleteFacebookPost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken } = secret;

    const response = await deleteFBPost(postId, accessToken);
    console.log("response: ", response);

    res.json({ status: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting Facebook post:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

export const postVideoOnFacebook = asyncHandler(async (req, res, next) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;
    if (req.files) {
      const response = await uploadVideoToFB(pageId, accessToken, req.body, req.files.video.data);
      res.status(201).json({ status: true, data: response });
    } else {
      return res.status(400).json({ status: false, error: "video is required" });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: "Server error" });
  }
});

export const getRatings = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;
    const response = await getPageRatings(pageId, accessToken);
    res.status(200).json({ status: true, data: response.data });
  } catch (error) {
    res.status(500).json({ status: false, error: "Server error" });
  }
});

export const getInsights = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.META);
    const { page_access_token: accessToken, social_media_id: pageId } = secret;
    const response = await getPageInsights(pageId, accessToken, META.METRICS);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, error: "Server error" });
  }
});


export const getFacebookPostInsights = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.id; 
    console.log('postId:=============================', postId);
    const [secret] = await getSecrets(SOCIAL_MEDIA.FACEBOOK);
    const accessToken = secret.page_access_token; 

    if (!postId) {
      return res.status(400).json({ success: false, message: "Post ID is required" });
    }

    // Define the fields to fetch
    const fields = "likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions)";
    console.log('fields:==================================', fields);

    // Fetch post insights using the Facebook Graph API
    const response = await axios.get(`https://graph.facebook.com/v19.0/${postId}`, {
      params: {
        fields,
        access_token: accessToken,
      },
    });
    console.log('response: ', response);

    const data = response.data;

    const totalLikes = data.likes?.summary?.total_count || 0;
    const totalComments = data.comments?.summary?.total_count || 0;
    const totalShares = data.shares?.count || 0;
    const totalViews = data.insights?.data?.find((item) => item.name === "post_impressions")?.values[0]?.value || 0;

    return res.status(200).json({
      success: true,
      data: {
        postId,
        totalLikes,
        totalComments,
        totalShares,
        totalViews,
      },
    });
  } catch (error) {
    console.error("Error fetching Facebook post insights data:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
});