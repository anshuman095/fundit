import { Router } from "express";
import { createUpdateWhoAreWe, getWhoAreWe } from "../../Controller/whoAreWeController.js";

const whoAreWeRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: WhoAreWe
 *     description: Operations related to "Who Are We" section
 */

/**
 * @swagger
 * /api/whoWeAre/create-update-who-are-we:
 *   post:
 *     summary: Create or update "Who Are We" information
 *     tags: [WhoAreWe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Image URL or data
 *               title:
 *                 type: string
 *                 description: The title of the section
 *               sub_title:
 *                 type: string
 *                 description: The subtitle of the section
 *               description:
 *                 type: string
 *                 description: The description of the section
 *               deleted:
 *                 type: integer
 *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
 *     responses:
 *       200:
 *         description: Who Are We information created or updated successfully
 *       400:
 *         description: Bad request
 */
whoAreWeRoutes.post("/create-update-who-are-we", createUpdateWhoAreWe);

/**
 * @swagger
 * /api/whoWeAre/get-who-are-we:
 *   get:
 *     summary: Get Who Are We information
 *     tags: [WhoAreWe]
 *     responses:
 *       200:
 *         description: Who Are We information retrieved successfully
 *       404:
 *         description: Who Are We information not found
 */
whoAreWeRoutes.get("/get-who-are-we/:id?", getWhoAreWe);

export default whoAreWeRoutes;
