import { Router } from "express";
import {
  createFacebookPost,
  updateFacebookPost,
  deleteFacebookPost,
  handleFacebookLogin,
  handleFacebookRedirect,
  checkFacebookAccessToken,
  getFacebookAccounts,
  getFacebookPosts,
  postImageOnFacebook,
  postVideoOnFacebook,
  getRatings,
  getInsights,
} from "../../Controller/facebookController.js";
import { saveRedirectUri, validate } from "../../helper/general.js";
import { postFbSchema, socialMediaSecretSchema } from "../../helper/validations.js";
import { checkAccessToken } from "../../helper/tokenVerify.js";

const facebookRoutes = Router();

// Route to initiate Facebook login
facebookRoutes.post("/auth/meta", validate(socialMediaSecretSchema), saveRedirectUri, handleFacebookLogin);

// Route for Facebook OAuth callback (redirect URI)
facebookRoutes.get("/auth/meta/callback", handleFacebookRedirect);

facebookRoutes.get("/get-accounts", getFacebookAccounts);

facebookRoutes.get("/get-posts", getFacebookPosts);
facebookRoutes.get("/get-rating", getRatings);
facebookRoutes.get("/get-insights", getInsights);
facebookRoutes.post("/post-image", postImageOnFacebook);

facebookRoutes.post("/upload-video", postVideoOnFacebook);
// Route to create a Facebook post
facebookRoutes.post("/create-post", validate(postFbSchema), createFacebookPost);

// Route to update a Facebook post
facebookRoutes.put("/post/update/:postId", updateFacebookPost);

// Route to delete a Facebook post
facebookRoutes.delete("/delete-post/:postId", deleteFacebookPost);

export default facebookRoutes;
