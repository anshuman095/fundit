import { Router } from "express";
import { createUpdateService, deleteServices, getServices } from "../../Controller/ourServicesController.js";

const ourServicesRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Our Services
 *   description: Operations related to our services
 */

/**
 * @swagger
 * /api/services/create-update-our-services:
 *   post:
 *     summary: Create or update our services
 *     tags: [Our Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the service
 *               description:
 *                 type: string
 *                 description: The description of the service
 *               table_for_services:
 *                 type: string
 *                 default: "services"
 *                 description: Table name associated with the services
 *               deleted:
 *                 type: integer
 *                 default: 0
 *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
 *     responses:
 *       200:
 *         description: Our services created or updated successfully
 *       400:
 *         description: Bad request
 */
// ourServicesRoutes.post("/create-update-our-services", createUpdateOurServices);

/**
 * @swagger
 * /api/services/get-our-services:
 *   get:
 *     summary: Get all our services
 *     tags: [Our Services]
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *       404:
 *         description: Services not found
 */
// ourServicesRoutes.get("/get-our-services", getOurService);

/**
 * @swagger
 * /api/services/get-our-services/{id}:
 *   get:
 *     summary: Get a specific service by ID
 *     tags: [Our Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to retrieve
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
// ourServicesRoutes.get("/get-our-services/:id", getOurService);

/**
 * @swagger
 * /api/services/delete-services/{id}:
 *   delete:
 *     summary: Delete a service by ID
 *     tags: [Our Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to delete
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
// ourServicesRoutes.delete("/delete-services/:id", deleteServices);

// /**
//  * @swagger
//  * /api/services/create-update-services:
//  *   post:
//  *     summary: Create or update a service
//  *     tags: [Our Services]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 description: The image URL or data for the service
//  *               title:
//  *                 type: string
//  *                 description: The title of the service
//  *               description:
//  *                 type: string
//  *                 description: The description of the service
//  *               deleted:
//  *                 type: integer
//  *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
//  *     responses:
//  *       200:
//  *         description: Service created or updated successfully
//  *       400:
//  *         description: Bad request
//  */

/**
 * @swagger
 * /api/services/create-update-services:
 *   post:
 *     summary: Create or update the Services sections
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Services entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "service 1", "description": "Description of service 1"}, {"section": 2,"title": "service 2", "description": "Description of service 2"}]'
 *               sections[0].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Services section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Services entries processed successfully.
 *       201:
 *         description: Services section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Services entries processed successfully.
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
 *                 message:
 *                   type: string
 *                   example: Invalid request data.
 */
ourServicesRoutes.post("/create-update-services", createUpdateService);

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
