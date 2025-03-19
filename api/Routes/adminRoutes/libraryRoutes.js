import { Router } from "express";
import { createUpdateLibrary, getLibrary } from "../../Controller/libraryController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const library = Router();

/**
 * @swagger
 * /api/library/create-update-library:
 *   post:
 *     summary: Create or update the Library sections
 *     tags: [Library]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Library entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"category": "Library 1", "description": "Description of Library 1"}, {"category": "Library 2", "description": "Description of Library 2"}]'
 *               sections[0].asset:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].asset:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Library entries processed successfully
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
 *                   example: Library entries processed successfully.
 *       201:
 *         description: Library entries processed successfully
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
 *                   example: Library entries processed successfully.
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

library.post("/create-update-library", createUpdateLibrary);

/**
 * @swagger
 * /api/library/get-library:
 *   get:
 *     summary: Get all Library
 *     tags: [Library]
 *     responses:
 *       200:
 *         description: Library retrieved successfully
 *       404:
 *         description: Library not found
 */
library.get("/get-library/:id?", getLibrary);

export default library;
