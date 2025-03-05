import { Router } from "express";
import { getServices } from "../../Controller/ourServicesController";

const ourServicesRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Our Services
 *   description: Operations related to our services
 */

/**
 * @swagger
 * /api/services/get-services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *       404:
 *         description: Services not found
 */
ourServicesRoutes.get("/get-services/:id?", getServices);

export default ourServicesRoutes;
