import { Router } from "express";
import {
  deleteAComment,
  getCommentDetails,
  getCommentsOnMedia,
  getInstaAccountInsights,
  getInstagramPostInsights,
  getInstaMediaInsights,
  getInstaMedias,
  getInstaProfile,
  getInstaStories,
  getReplyOnComment,
  postInstagram,
  replyToAComment,
} from "../../Controller/instagramController.js";

const instagramRoutes = Router();

instagramRoutes.post("/create-post", postInstagram);
instagramRoutes.get("/get-profile", getInstaProfile);
instagramRoutes.get("/get-all-media", getInstaMedias);
instagramRoutes.get("/get-story", getInstaStories);
instagramRoutes.get("/get-comments/:mediaId", getCommentsOnMedia);
instagramRoutes.get("/get-replies/:commentId", getReplyOnComment);
instagramRoutes.post("/reply-on-comment", replyToAComment);
instagramRoutes.delete("/delete-comment/:commentId", deleteAComment);
instagramRoutes.get("/get-comment-details/:commentId", getCommentDetails);
instagramRoutes.get("/get-account-insights", getInstaAccountInsights);
instagramRoutes.get("/get-total/:postId", getInstagramPostInsights);
instagramRoutes.get("/get-media-insights/:mediaId", getInstaMediaInsights);
export default instagramRoutes;
