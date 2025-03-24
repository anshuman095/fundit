import { Router } from "express";
import { createUpdateSpiritual, getSpiritual } from "../../Controller/spiritualController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const spiritual = Router();

/**
 * @swagger
 * /api/spiritual/create-update-spiritual:
 *   post:
 *     summary: Create or update the Spiritual sections
 *     tags: [Spiritual]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Spiritual entry (for updates)
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Spiritual entries processed successfully
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
 *                   example: Spiritual entries processed successfully.
 *       201:
 *         description: Spiritual entries processed successfully
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
 *                   example: Spiritual entries processed successfully.
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

spiritual.post("/create-update-spiritual", createUpdateSpiritual);

/**
 * @swagger
 * /api/spiritual/get-spiritual:
 *   get:
 *     summary: Get all Spiritual
 *     tags: [Spiritual]
 *     responses:
 *       200:
 *         description: Spiritual retrieved successfully
 *       404:
 *         description: Spiritual not found
 */
spiritual.get("/get-spiritual/:id?", getSpiritual);

export default spiritual;
