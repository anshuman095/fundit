import { Router } from "express";
import {
  createUpdateSocialMediaSecret,
  deleteSocialMediaSecret,
  getPostById,
  getPosts,
  getSocialMediaSecret,
} from "../../Controller/socialMediaSecretController.js";
import { validate } from "../../helper/general.js";
import { socialMediaSecretSchema } from "../../helper/validations.js";
import { createUpdateLinkedInPost } from "../../Controller/linkedInController.js";
import { createFacebookPost } from "../../Controller/facebookController.js";
import { postInstagram } from "../../Controller/instagramController.js";
import { createTweet } from "../../Controller/twitterController.js";

const socialMediaSecretRoutes = Router();

socialMediaSecretRoutes.post("/create-update", createUpdateSocialMediaSecret);
socialMediaSecretRoutes.get("/get/:id?", getSocialMediaSecret);
socialMediaSecretRoutes.get("/get-posts", getPosts);
socialMediaSecretRoutes.get("/get-post/:id", getPostById);
socialMediaSecretRoutes.delete("/delete/:id", deleteSocialMediaSecret);
socialMediaSecretRoutes.post("/post", createUpdateLinkedInPost, createFacebookPost, postInstagram, createTweet);
export default socialMediaSecretRoutes;
