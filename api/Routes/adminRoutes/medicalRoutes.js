import { Router } from "express";
import { createUpdateMedical, getMedical } from "../../Controller/medicalController.js";
import { validate } from "../../helper/general.js";
// import { MedicalCenterSchema } from "../../helper/validations.js";

const medicalRoutes = Router();

/**
 * @swagger
 * /api/medical/create-update-medical:
 *   post:
 *     summary: Create or update the Medical sections
 *     tags: [Medical]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Medical entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "Medical 1", "description": "Description of Medical 1"}, {"section": 2,"title": "Medical 2", "description": "Description of Medical 2"}]'
 *               sections[0].slider:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].slider:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Medical entries processed successfully
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
 *                   example: Medical entries processed successfully.
 *       201:
 *         description: Medical entries processed successfully
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
 *                   example: Medical entries processed successfully.
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
 *                   type: string
 *                   example: Invalid request data.
 */

medicalRoutes.post("/create-update-medical", createUpdateMedical);

/**
 * @swagger
 * /api/medical/get-medical:
 *   get:
 *     summary: Get all Medical
 *     tags: [Medical]
 *     responses:
 *       200:
 *         description: Medical retrieved successfully
 *       404:
 *         description: Medical not found
 */
medicalRoutes.get("/get-medical/:id?", getMedical);

export default medicalRoutes;
