import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import qs from "querystring";
import OAuth1 from "oauth-1.0a";
import crypto, { sign } from "crypto";
import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import { getRedirectUrl, saveMetaData, uploadFile, uploadMediaToTwitter } from "../helper/general.js";
import { SOCIAL_MEDIA, TWITTER } from "../helper/constants.js";
import { getSecrets, saveSecrets } from "./socialMediaSecretController.js";
const db = makeDb();

const tamonashUserId = "1361334318589571073";

async function getClient() {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.TWITTER);
    const client = new TwitterApi({
      appKey: secret.client_id,
      appSecret: secret.client_secret,
      accessToken: secret.access_token,
      accessSecret: secret.access_secret,
    });
    const twitterClient = client.readWrite;

    return { twitterClient, loggedInUserId: secret.social_media_id };
  } catch (error) {
    throw error;
  }
}

export const requestToken = asyncHandler(async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.TWITTER);
    const { client_id, client_secret } = req.body;
    const requestData = {
      url: TWITTER.REQUEST_TOKEN_URL,
      method: "POST",
      data: { oauth_callback: secret.valid_oauth_uri },
    };
    const oauth = OAuth1({
      consumer: { key: client_id, secret: client_secret },
      signature_method: "HMAC-SHA1",
      hash_function: (baseString, key) => crypto.createHmac("sha1", key).update(baseString).digest("base64"),
    });
    const signedRequest = await oauth.authorize(requestData);
    const response = await axios.post(requestData.url, qs.stringify(signedRequest), {
      headers: {
        Authorization: oauth.toHeader(signedRequest).Authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = qs.parse(response.data);
    const oauthToken = data.oauth_token;
    const redirectUrl = `${TWITTER.AUTHORIZE_URL}?oauth_token=${oauthToken}`;
    await saveSecrets(req.body, secret.id);
    res.status(200).json({ status: true, redirectUrl: redirectUrl });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const handleCallback = asyncHandler(async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const url = `${TWITTER.ACCESS_TOKEN_URL}?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`;
    const response = await axios.post(url);
    const data = qs.parse(response.data);
    const [secret] = await getSecrets(SOCIAL_MEDIA.TWITTER);
    const mappedData = {
      access_token: data.oauth_token,
      access_secret: data.oauth_token_secret,
      social_media_id: data.user_id,
    };
    await saveSecrets(mappedData, secret?.id);
    res.redirect(`${process.env.FRONTEND_URI}?tab=twitter`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const getMe = asyncHandler(async (req, res) => {
  try {
    const { twitterClient } = await getClient();
    const currentUser = await twitterClient.currentUser();
    // const user = await twitterClient.v2.me();
    res.status(200).json({ status: true, data: currentUser });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const createTweet = asyncHandler(async (req, res) => {
  try {
    const mediaFiles = req.files?.media;
    const textContent = req.body.content || "";
    const type = req.body.type;
    // return console.log("type: ", type);

    if (type.includes("twitter") == false) {
      console.log("twitter");

      return res.status(200).json({ status: true, message: "post created successfully." });
    }
    const { twitterClient } = await getClient();
    const mediaIds = [];

    if (mediaFiles) {
      if (Array.isArray(mediaFiles)) {
        // Multiple files
        for (const mediaFile of mediaFiles) {
          const mediaId = await twitterClient.v1.uploadMedia(mediaFile.data, { mimeType: mediaFile.mimetype });
          mediaIds.push(mediaId);
        }
      } else {
        // Single file
        const mediaId = await twitterClient.v1.uploadMedia(mediaFiles.data, { mimeType: mediaFiles.mimetype });
        mediaIds.push(mediaId);
        req.body.media = await uploadFile("social_post", req.files.media);
      }
    }
    // console.log("type: ", type);

    let options = {};
    if (mediaIds.length) {
      options = {
        media: { media_ids: mediaIds },
      };
    }

    // const tweetResponse = await twitterClient.v1.tweet(textContent, {});
    const response = await twitterClient.v2.tweet(textContent || "", options);

    const query = `SELECT * FROM post WHERE media = ? AND content = ?`;
    const result = await db.query(query, [req.body.media, req.body.content]);
    console.log("result: Twitter ", result);
    let postData = {};
    if (result.length > 0) {
      const type = JSON.parse(result[0].type);
      type.push("Twitter");
      postData.type = JSON.stringify(type);
      postData.id = result[0].id;
      await saveMetaData(postData);
    } else {
      postData.type = JSON.stringify(["Twitter"]);
      postData.media = req.body.media;
      postData.content = req.body.content;
      postData.media_type = media_type;
      await saveMetaData(postData);
    }
    return res.status(201).json({ status: true, data: response.data, message: "post created successfully" });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const getTimeline = asyncHandler(async (req, res) => {
  try {
    const { twitterClient } = await getClient();
    const timeline = await twitterClient.v2.homeTimeline();
    res.status(200).json({ status: true, data: timeline });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const getUsersByName = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const { twitterClient } = await getClient();
    const user = await twitterClient.v2.usersByUsernames(username);
    res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { twitterClient } = await getClient();
    await twitterClient.v2.deleteTweet(tweetId);
    res.status(200).json({ status: true, message: "Tweet deleted successfully" });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

const getUserTweetsWithPagination = async (twitterClient, userId, maxResults = 10, paginationToken = null) => {
  try {
    const params = { max_results: maxResults };
    if (paginationToken) params.pagination_token = paginationToken;

    const response = await twitterClient.v2.userTimeline(userId, params);
    return {
      tweets: response.data.data || [],
      meta: response.data.meta || {}, // Meta contains next_token, result_count, etc.
    };
  } catch (error) {
    throw error;
  }
};

export const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { maxResults = 10, paginationToken = null } = req.query;

    const { twitterClient } = await getClient();

    const userTweetsWithPagination = await getUserTweetsWithPagination(
      twitterClient,
      id,
      parseInt(maxResults),
      paginationToken
    );
    // const userTweets = await twitterClient.v2.userTimeline(id, { exclude: "replies" });
    res
      .status(200)
      .json({ status: true, data: { tweets: userTweetsWithPagination.tweets, meta: userTweetsWithPagination.meta } });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const searchTweets = asyncHandler(async (req, res) => {
  try {
    const { search } = req.params;
    const { twitterClient } = await getClient();
    const tweets = await twitterClient.v2.search(search);
    res.status(200).json({ status: true, data: tweets });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const getSingleTweet = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient } = await getClient();
    const tweet = await twitterClient.v2.singleTweet(id);
    res.status(200).json({ status: true, data: tweet.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

// create api to like a tweet

export const likeTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { twitterClient, loggedInUserId } = await getClient();
    const tweet = await twitterClient.v2.like(loggedInUserId, tweetId);
    res.status(200).json({ status: true, data: tweet.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

// create api to unlike a tweet

export const unlikeTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { twitterClient, loggedInUserId } = await getClient();
    const tweet = await twitterClient.v2.unlike(loggedInUserId, tweetId);
    res.status(200).json({ status: true, data: tweet.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

// create api to get single user by id
export const getSingleUserById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient } = await getClient();
    const options = {};
    const user = await twitterClient.v2.user(id, options);
    res.status(200).json({ status: true, data: user.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
// create api to get likes of a user by id

export const getLikedTweetsByUserId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient } = await getClient();
    const likedTweets = await twitterClient.v2.userLikedTweets(id);
    res.status(200).json({ status: true, data: likedTweets.data, tweets: likedTweets.tweets });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
// create api to get followers of a user by id

export const getFollowersByUserId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient } = await getClient();
    const followers = await twitterClient.v2.followers(id);
    res.status(200).json({ status: true, data: followers.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
// create api to get following of a user by id

export const getFollowingByUserId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient } = await getClient();
    const following = await twitterClient.v2.following(id);
    res.status(200).json({ status: true, data: following.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
// api to follow someone

export const follow = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient, loggedInUserId } = await getClient();
    const data = await twitterClient.v2.follow(loggedInUserId, id);
    res.status(200).json({ status: true, data: data.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
// api to unfollow someone

export const unfollow = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { twitterClient, loggedInUserId } = await getClient();
    const data = await twitterClient.v2.unfollow(loggedInUserId, id);
    res.status(200).json({ status: true, data: data.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

//bookmark
export const addTweetToBookmark = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { twitterClient } = await getClient();
    const tweet = await twitterClient.v2.bookmark(tweetId);
    res.status(200).json({ status: true, data: tweet.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const removeTweetFromBookmark = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { twitterClient } = await getClient();
    const tweet = await twitterClient.v2.deleteBookmark(tweetId);
    res.status(200).json({ status: true, data: tweet.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});

export const getBookmarks = asyncHandler(async (req, res) => {
  try {
    const { twitterClient } = await getClient();
    const bookmarks = await twitterClient.v2.bookmarks({ expansions: ["referenced_tweets.id"] });
    res.status(200).json({ status: true, data: bookmarks.data });
  } catch (error) {
    console.error(error.data || error.message);
    res.status(500).json({ status: false, error: error.data || error.message });
  }
});
