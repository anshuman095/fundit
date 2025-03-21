import { Router } from "express";
import { createUpdateHistoryContent, getHistoryContent } from "../../Controller/historyContentController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const historyContent = Router();

/**
 * @swagger
 * /api/historyContent/create-update-history-content:
 *   post:
 *     summary: Create or update the History Content
 *     tags: [History Content]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the History Content entry (for updates)
 *     responses:
 *       200:
 *         description: History Content entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: History Content entries processed successfully.
 *       201:
 *         description: History Content entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: History Content entries processed successfully.
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

historyContent.post("/create-update-history-content", createUpdateHistoryContent);

/**
 * @swagger
 * /api/historyContent/get-history-content:
 *   get:
 *     summary: Get all History Content
 *     tags: [History Content]
 *     responses:
 *       200:
 *         description: History Content retrieved successfully
 *       404:
 *         description: History Content not found
 */
historyContent.get("/get-history-content/:id?", getHistoryContent);

export default historyContent;
