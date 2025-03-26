import { Router } from "express";
import {
  addTweetToBookmark,
  createTweet,
  deleteTweet,
  follow,
  getBookmarks,
  getFollowersByUserId,
  getFollowingByUserId,
  getLikedTweetsByUserId,
  getMe,
  getSingleUserById,
  getTimeline,
  getTwitterPostInsights,
  getUsersByName,
  getUserTweets,
  handleCallback,
  likeTweet,
  removeTweetFromBookmark,
  requestToken,
  unfollow,
  unlikeTweet,
} from "../../Controller/twitterController.js";
import { validate } from "../../helper/general.js";
import { socialMediaSecretSchema } from "../../helper/validations.js";

const twitterRoutes = Router();
twitterRoutes.post("/request-token", validate(socialMediaSecretSchema), requestToken);
twitterRoutes.get("/auth/twitter/callback", handleCallback);
twitterRoutes.get("/me", getMe);
twitterRoutes.post("/create", createTweet);
twitterRoutes.get("/get-recent-posts", getTimeline);
twitterRoutes.get("/get-user-by-username/:username", getUsersByName);
twitterRoutes.delete("/delete/:tweetId", deleteTweet);
twitterRoutes.get("/get-tweets/:id", getUserTweets);
twitterRoutes.post("/like/:tweetId", likeTweet);
twitterRoutes.delete("/unlike/:tweetId", unlikeTweet);
twitterRoutes.get("/get-user-by-id/:id", getSingleUserById);
twitterRoutes.get("/get-liked-tweets-by-id/:id", getLikedTweetsByUserId);
twitterRoutes.get("/get-followers/:id", getFollowersByUserId);
twitterRoutes.get("/get-following/:id", getFollowingByUserId);
twitterRoutes.post("/follow/:id", follow);
twitterRoutes.delete("/unfollow/:id", unfollow);
twitterRoutes.post("/add-to-bookmark/:tweetId", addTweetToBookmark);
twitterRoutes.delete("/remove-bookmark/:tweetId", removeTweetFromBookmark);
twitterRoutes.get("/get-bookmarks", getBookmarks);
twitterRoutes.get("/get-total/:tweetId", getTwitterPostInsights);

export default twitterRoutes;
