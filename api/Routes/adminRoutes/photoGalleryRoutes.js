import { Router } from "express";
import { createUpdatePhotoGallery, getPhotoGallery } from "../../Controller/photoGalleryController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const photoGallery = Router();

/**
 * @swagger
 * /api/photoGallery/create-update-photo-gallery:
 *   post:
 *     summary: Create or update the Photo Gallery
 *     tags: [Photo Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Photo Gallery entry (for updates)
 *               photo_gallery:
 *                 type: json
 *                 description: Array of sections with image URL (as JSON string)
 *                 example: '[{"media": "/photo_gallery/logo.png"}]'
 *             required:
 *               - photo_gallery
 *     responses:
 *       200:
 *         description: Photo Gallery entries processed successfully
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
 *                   example: Photo Gallery entries processed successfully.
 *       201:
 *         description: Photo Gallery entries processed successfully
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
 *                   example: Photo Gallery entries processed successfully.
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

photoGallery.post("/create-update-photo-gallery", createUpdatePhotoGallery);

/**
 * @swagger
 * /api/photoGallery/get-photo-gallery:
 *   get:
 *     summary: Get all PhotoGallery
 *     tags: [PhotoGallery]
 *     responses:
 *       200:
 *         description: Photo Gallery retrieved successfully
 *       404:
 *         description: Photo Gallery not found
 */
photoGallery.get("/get-photo-gallery/:id?", getPhotoGallery);

export default photoGallery;
