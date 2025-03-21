import { Router } from "express";
import { createUpdateFooter, getFooter } from "../../Controller/FooterController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const footer = Router();

/**
 * @swagger
 * /api/footer/create-update-footer:
 *   post:
 *     summary: Create or update the Footer
 *     tags: [Footer]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Footer entry (for updates)
 *     responses:
 *       200:
 *         description: Footer entries processed successfully
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
 *                   example: Footer entries processed successfully.
 *       201:
 *         description: Footer entries processed successfully
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
 *                   example: Footer entries processed successfully.
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

footer.post("/create-update-footer", createUpdateFooter);

/**
 * @swagger
 * /api/footer/get-footer:
 *   get:
 *     summary: Get all Footer
 *     tags: [Footer]
 *     responses:
 *       200:
 *         description: Footer retrieved successfully
 *       404:
 *         description: Footer not found
 */
footer.get("/get-footer/:id?", getFooter);

export default footer;
