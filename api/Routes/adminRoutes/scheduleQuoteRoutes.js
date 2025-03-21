import { Router } from "express";
import { createUpdateScheduleQuote, deleteScheduleQuote, getScheduleQuote } from "../../Controller/scheduleQuoteController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const scheduleQuote = Router();

/**
 * @swagger
 * /api/scheduleQuote/create-update-schedule-quote:
 *   post:
 *     summary: Create or update the Schedule Quote
 *     tags: [Schedule Quote]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Schedule Quote entry (for updates)
 *     responses:
 *       200:
 *         description: Schedule Quote entries processed successfully
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
 *                   example: Schedule Quote entries processed successfully.
 *       201:
 *         description: Schedule Quote entries processed successfully
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
 *                   example: Schedule Quote entries processed successfully.
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

scheduleQuote.post("/create-update-schedule-quote", createUpdateScheduleQuote);

/**
 * @swagger
 * /api/scheduleQuote/get-schedule-quote:
 *   get:
 *     summary: Get all Schedule Quote
 *     tags: [Schedule Quote]
 *     responses:
 *       200:
 *         description: Schedule Quote retrieved successfully
 *       404:
 *         description: Schedule Quote not found
 */
scheduleQuote.get("/get-schedule-quote/:id?", getScheduleQuote);

scheduleQuote.delete("/delete-schedule-quote/:id", deleteScheduleQuote);

export default scheduleQuote;
