import { Router } from "express";
import { createUpdateSubscribe, getSubscribe } from "../../Controller/subscribeController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const subscribe = Router();

/**
 * @swagger
 * /api/subscribe/create-update-subscribe:
 *   post:
 *     summary: Create or update the Subscribe
 *     tags: [Subscribe]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Subscribe entry (for updates)
 *     responses:
 *       200:
 *         description: Subscribe entries processed successfully
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
 *                   example: Subscribe entries processed successfully.
 *       201:
 *         description: Subscribe entries processed successfully
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
 *                   example: Subscribe entries processed successfully.
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
subscribe.post("/create-update-subscribe", createUpdateSubscribe);

/**
 * @swagger
 * /api/subscribe/get-subscribe:
 *   get:
 *     summary: Get all Subscribe
 *     tags: [Subscribe]
 *     responses:
 *       200:
 *         description: Subscribe retrieved successfully
 *       404:
 *         description: Subscribe not found
 */
subscribe.get("/get-subscribe/:id?", getSubscribe);

export default subscribe;
