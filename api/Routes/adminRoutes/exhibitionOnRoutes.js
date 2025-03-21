import { Router } from "express";
import { createUpdateExhibitionOn, getExhibitionOn } from "../../Controller/exhibitionOnController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const exhibitionOn = Router();

/**
 * @swagger
 * /api/exhibitionOn/create-update-exhibition-on:
 *   post:
 *     summary: Create or update the ExhibitionOn sections
 *     tags: [Exhibition On]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Exhibition On entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"title": "ExhibitionOn 1", "description": "Description of ExhibitionOn 1"}, {"title": "ExhibitionOn 2", "description": "Description of ExhibitionOn 2"}]'
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Exhibition On entries processed successfully
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
 *                   example: Exhibition On entries processed successfully.
 *       201:
 *         description: Exhibition On entries processed successfully
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
 *                   example: Exhibition On entries processed successfully.
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

exhibitionOn.post("/create-update-exhibition-on", createUpdateExhibitionOn);

/**
 * @swagger
 * /api/exhibitionOn/get-exhibition-on:
 *   get:
 *     summary: Get all ExhibitionOn
 *     tags: [ExhibitionOn]
 *     responses:
 *       200:
 *         description: ExhibitionOn retrieved successfully
 *       404:
 *         description: ExhibitionOn not found
 */
exhibitionOn.get("/get-exhibition-on/:id?", getExhibitionOn);

export default exhibitionOn;
