import { Router } from "express";
import { getWhoAreWe } from "../../Controller/whoAreWeController";

const whoAreWeRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: WhoAreWe
 *     description: Operations related to "Who Are We" section
 */

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
