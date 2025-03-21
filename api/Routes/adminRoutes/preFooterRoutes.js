import { Router } from "express";
import { createUpdatePreFooter, getPreFooter } from "../../Controller/preFooterController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const preFooter = Router();

/**
 * @swagger
 * /api/preFooter/create-update-pre-footer:
 *   post:
 *     summary: Create or update the Pre Footer
 *     tags: [Pre Footer]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Pre Footer entry (for updates)
 *     responses:
 *       200:
 *         description: Pre Footer entries processed successfully
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
 *                   example: Pre Footer entries processed successfully.
 *       201:
 *         description: Pre Footer entries processed successfully
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
 *                   example: Pre Footer entries processed successfully.
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

preFooter.post("/create-update-pre-footer", createUpdatePreFooter);

/**
 * @swagger
 * /api/preFooter/get-pre-footer:
 *   get:
 *     summary: Get all Pre Footer
 *     tags: [Pre Footer]
 *     responses:
 *       200:
 *         description: Pre Footer retrieved successfully
 *       404:
 *         description: Pre Footer not found
 */
preFooter.get("/get-pre-footer/:id?", getPreFooter);

export default preFooter;
