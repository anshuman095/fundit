import { Router } from "express";
import { createUpdateBannerSection, getBannerSection } from "../../Controller/bannerSectionController.js";
import { validate } from "../../helper/general.js";
import { bannerSectionSchema } from "../../helper/validations.js";

const bannerSectionRoutes = Router();

/**
 * @swagger
 * /api/bannerSection/create-update-banner-section:
 *   post:
 *     summary: Create or update the Banner Section sections
 *     tags: [Banner Section]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Banner Section entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "Banner Section 1", "description": "Description of Banner Section 1"}, {"section": 2,"title": "Banner Section 2", "description": "Description of Banner Section 2"}]'
 *               sections[0].media:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].media:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Banner Section entries processed successfully
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
 *                   example: Banner Section entries processed successfully.
 *       201:
 *         description: Banner Section entries processed successfully
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
 *                   example: Banner Section entries processed successfully.
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

bannerSectionRoutes.post("/create-update-banner-section", createUpdateBannerSection);

/**
 * @swagger
 * /api/bannerSection/get-banner-section:
 *   get:
 *     summary: Get all Banner Section
 *     tags: [Banner Section]
 *     responses:
 *       200:
 *         description: Banner Section retrieved successfully
 *       404:
 *         description: Banner Section not found
 */
bannerSectionRoutes.get("/get-banner-section/:id?", getBannerSection);

export default bannerSectionRoutes;
