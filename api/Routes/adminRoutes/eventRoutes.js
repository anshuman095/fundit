import { Router } from "express";
import { createUpdateEvent, getEvent } from "../../Controller/eventController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const event = Router();

/**
 * @swagger
 * /api/event/create-update-event:
 *   post:
 *     summary: Create or update the Event sections
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Event entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"title": "Event 1", "description": "Description of Event 1"}, {"title": "Event 2", "description": "Description of Event 2"}]'
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Event entries processed successfully
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
 *                   example: Event entries processed successfully.
 *       201:
 *         description: Event entries processed successfully
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
 *                   example: Event entries processed successfully.
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

event.post("/create-update-event", createUpdateEvent);

/**
 * @swagger
 * /api/event/get-event:
 *   get:
 *     summary: Get all Event
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
event.get("/get-event/:id?", getEvent);

export default event;
