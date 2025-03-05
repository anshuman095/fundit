import { Router } from "express";
import { getLocations } from "../../Controller/locationController.js";

const locationRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Operations related to locations
 */

/**
 * @swagger
 * /api/location/get-location:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 *       404:
 *         description: Locations not found
 */
locationRoutes.get("/get-location", getLocations);

export default locationRoutes;
