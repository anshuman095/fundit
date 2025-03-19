import { Router } from "express";
import { createUpdateComputerCentre, getComputerCentre } from "../../Controller/computerCentreController.js";
import { validate } from "../../helper/general.js";
// import { ComputerCentreSchema } from "../../helper/validations.js";

const computerCentreRoutes = Router();

/**
 * @swagger
 * /api/computerCentre/create-update-computer-centre:
 *   post:
 *     summary: Create or update the Computer Centre sections
 *     tags: [Computer Centre]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Computer Centre entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "Computer Centre 1", "description": "Description of Computer Centre 1"}, {"section": 2,"title": "Computer Centre 2", "description": "Description of Computer Centre 2"}]'
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
 *         description: Computer center entries processed successfully
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
 *                   example: Computer Centre entries processed successfully.
 *       201:
 *         description: Computer center entries processed successfully
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
 *                   example: Computer Centre entries processed successfully.
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

computerCentreRoutes.post("/create-update-computer-centre", createUpdateComputerCentre);

/**
 * @swagger
 * /api/computerCentre/get-computer-centre:
 *   get:
 *     summary: Get all Computer Centre
 *     tags: [Computer Centre]
 *     responses:
 *       200:
 *         description: Computer Centre retrieved successfully
 *       404:
 *         description: Computer Centre not found
 */
computerCentreRoutes.get("/get-computer-centre/:id?", getComputerCentre);

export default computerCentreRoutes;
