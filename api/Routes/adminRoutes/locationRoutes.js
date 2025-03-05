import { Router } from "express";
import { createUpdateLocation, deleteLocations, getLocations } from "../../Controller/locationController.js";
import { validate } from "../../helper/general.js";
import { locationSchema } from "../../helper/validations.js";

const locationRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Operations related to locations
 */
/**
 * @swagger
 * /api/location/create-update-location:
 *   post:
 *     summary: Create or update location entries
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Optional ID for updating an existing location entry
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     section:
 *                       type: integer
 *                       description: Section number
 *                     title:
 *                       type: string
 *                       description: Title of the location section
 *                     location:
 *                       type: string
 *                       description: Address of the location
 *                     latitude:
 *                       type: string
 *                       description: Latitude of the location
 *                       example: "41.8781"
 *                     longitude:
 *                       type: string
 *                       description: Longitude of the location
 *                       example: "-87.6298"
 *                     support_number:
 *                       type: string
 *                       description: Support contact number (10-digit format)
 *                       example: "1234567890"
 *                 description: Array of location sections. If `id` is present, sections can be an empty array; otherwise, at least one item is required.
 *     responses:
 *       200:
 *         description: Location created or updated successfully
 *       400:
 *         description: Bad request
 */

locationRoutes.post("/create-update-location", createUpdateLocation);

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

// /**
//  * @swagger
//  * /api/location/delete-location/{id}:
//  *   delete:
//  *     summary: Delete location by ID
//  *     tags: [Locations]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Location deleted successfully
//  *       404:
//  *         description: Location not found
//  */
locationRoutes.delete("/delete-location/:id", deleteLocations);

export default locationRoutes;
