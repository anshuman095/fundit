import { Router } from "express";
import { createUpdateLanguageCulture, getLanguageCulture } from "../../Controller/languageCultureController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const languageCultureRoutes = Router();

/**
 * @swagger
 * /api/languageCulture/create-update-language-culture:
 *   post:
 *     summary: Create or update the Language Culture sections
 *     tags: [Language Culture]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Language Culture entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "About us 1", "description": "Description of About us 1"}, {"section": 2,"title": "About us 2", "description": "Description of About us 2"}]'
 *               sections[0].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Language Culture section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: About us entries processed successfully.
 *       201:
 *         description: Language Culture section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: About us entries processed successfully.
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
 *                 message:
 *                   type: string
 *                   example: Invalid request data.
 */

languageCultureRoutes.post("/create-update-language-culture", createUpdateLanguageCulture);

/**
 * @swagger
 * /api/languageCulture/get-language-culture:
 *   get:
 *     summary: Get all About us
 *     tags: [Language Culture]
 *     responses:
 *       200:
 *         description: Language Culture retrieved successfully
 *       404:
 *         description: Language Culture not found
 */
languageCultureRoutes.get("/get-language-culture/:id?", getLanguageCulture);

export default languageCultureRoutes;
