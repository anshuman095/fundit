import { Router } from "express";

import {
  createUpdateLinkedInPost,
  deleteLinkedInPost,
  checkLinkedInAccessToken,
  getLinkedInPosts,
  handleLinkedInCallback,
  getPosts,
} from "../../Controller/linkedInController.js";

import dotenv from "dotenv";
import { getRedirectUrl, saveRedirectUri, storeError, validate } from "../../helper/general.js";
import { checkAccessToken, verifyToken } from "../../helper/tokenVerify.js";
import { getSecrets, saveSecrets } from "../../Controller/socialMediaSecretController.js";
import { LINKEDIN, SOCIAL_MEDIA } from "../../helper/constants.js";
import { socialMediaSecretSchema } from "../../helper/validations.js";
dotenv.config();

/**
 * @swagger
 * tags:
 *   name: LinkedIn
 *   description: Operations related to LinkedIn management
 */

const linkedInRoutes = Router();
/**
 * @swagger
 * /api/linkedin/auth/linkedin:
 *   get:
 *     summary: Redirect to LinkedIn OAuth login
 *     tags: [LinkedIn]
 *     responses:
 *       302:
 *         description: Redirect to LinkedIn login page
 */

const getUrlWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${base}?${query}`;
};

linkedInRoutes.post("/auth/linkedin", validate(socialMediaSecretSchema), saveRedirectUri, async (req, res) => {
  try {
    const [secret] = await getSecrets(SOCIAL_MEDIA.LINKEDIN);
    const params = {
      response_type: "code",
      client_id: req.body.client_id,
      redirect_uri: secret.valid_oauth_uri,
      state: Buffer.from(Math.round(Math.random() * Date.now()).toString()).toString("hex"),
      scope: LINKEDIN.SCOPES,
    };

    const authorizeUrlWithParams = getUrlWithQueryParams(LINKEDIN.AUTHORIZE_URL, params);

    saveSecrets(req.body, secret.id);
    return res.status(200).json({ status: true, redirectUrl: authorizeUrlWithParams });
  } catch (error) {
    storeError(error);
    return res.status(500).json({ status: false, error: error.message });
  }
});
/**
 * @swagger
 * /api/linkedin/auth/linkedin/callback:
 *   get:
 *     summary: LinkedIn OAuth callback to exchange code for access token
 *     tags: [LinkedIn]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LinkedIn access token retrieved successfully
 *       500:
 *         description: Failed to get LinkedIn access token
 */
linkedInRoutes.get("/auth/linkedin/callback", handleLinkedInCallback);

/**
 * @swagger
 * /api/linkedin/post:
 *   post:
 *     summary: Create a LinkedIn post with multiple images
 *     tags: [LinkedIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: LinkedIn post created successfully
 *       401:
 *         description: Unauthorized - LinkedIn access token not found
 *       500:
 *         description: Failed to create LinkedIn post
 */
linkedInRoutes
  .route("/post/:id?")
  .post(checkAccessToken(SOCIAL_MEDIA.LINKEDIN), createUpdateLinkedInPost)
  .get(checkAccessToken(SOCIAL_MEDIA.LINKEDIN), getLinkedInPosts);

/**
 * @swagger
 * /api/linkedin/post/{postId}:
 *   put:
 *     summary: Update a LinkedIn post by ID
 *     tags: [LinkedIn]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: LinkedIn post updated successfully
 *       401:
 *         description: Unauthorized - LinkedIn access token not found
 *       500:
 *         description: Failed to update LinkedIn post
 */

/**
 * @swagger
 * /api/linkedin/post/{postId}:
 *   delete:
 *     summary: Delete a LinkedIn post by ID
 *     tags: [LinkedIn]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: LinkedIn post deleted successfully
 *       401:
 *         description: Unauthorized - LinkedIn access token not found
 *       500:
 *         description: Failed to delete LinkedIn post
 */
linkedInRoutes.delete("/post/:id", checkAccessToken(SOCIAL_MEDIA.LINKEDIN), deleteLinkedInPost);

linkedInRoutes.get("/get", checkAccessToken(SOCIAL_MEDIA.LINKEDIN), getPosts);

export default linkedInRoutes;
