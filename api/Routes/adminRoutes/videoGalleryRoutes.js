import { Router } from "express";
import { createUpdateVideoGallery, getVideoGallery } from "../../Controller/videoGalleryController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const videoGallery = Router();

/**
 * @swagger
 * /api/videoGallery/create-update-video-gallery:
 *   post:
 *     summary: Create or update the Video Gallery
 *     tags: [Video Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Video Gallery entry (for updates)
 *               video_urls:
 *                 type: json
 *                 description: Array of sections with video URL (as JSON string)
 *             required:
 *               - video_urls
 *     responses:
 *       200:
 *         description: Video Gallery entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Video Gallery entries processed successfully.
 *       201:
 *         description: Video Gallery entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Video Gallery entries processed successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: json
 *                   example: Invalid request data.
 */

videoGallery.post("/create-update-video-gallery", createUpdateVideoGallery);

/**
 * @swagger
 * /api/VideoGallery/get-video-gallery:
 *   get:
 *     summary: Get all VideoGallery
 *     tags: [VideoGallery]
 *     responses:
 *       200:
 *         description: Video Gallery retrieved successfully
 *       404:
 *         description: Video Gallery not found
 */
videoGallery.get("/get-video-gallery/:id?", getVideoGallery);

export default videoGallery;
