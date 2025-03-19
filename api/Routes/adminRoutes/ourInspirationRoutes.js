import { Router } from "express";
import { createUpdateOurInspiration, getOurInspiration } from "../../Controller/ourInspirationController.js";
import { validate } from "../../helper/general.js";
import { ourInspirationSchema } from "../../helper/validations.js";

const ourInspirationRoutes = Router();

// /**
//  * @swagger
//  * /api/OurInspiration/create-update-about-us:
//  *   post:
//  *     summary: Create or update the About Us section
//  *     tags: [About Us]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 description: URL of the image
//  *               title:
//  *                 type: string
//  *                 description: Title of the About Us section
//  *               sub_title:
//  *                 type: string
//  *                 description: Subtitle of the About Us section
//  *               description:
//  *                 type: string
//  *                 description: Description of the About Us section
//  *             required:
//  *               - image
//  *               - title
//  *               - description
//  *     responses:
//  *       200:
//  *         description: Success
//  *       400:
//  *         description: Bad request
//  */

/**
 * @swagger
 * /api/OurInspiration/create-update-about-us:
 *   post:
 *     summary: Create or update the About Us sections
 *     tags: [About Us]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the About Us entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "About us 1", "description": "Description of About us 1"}, {"section": 2,"title": "About us 2", "description": "Description of About us 2"}]'
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
 *         description: About Us section updated successfully
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
 *                   example: About us entries processed successfully.
 *       201:
 *         description: About Us section created successfully
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
 *                   example: About us entries processed successfully.
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

ourInspirationRoutes.post("/create-update-our-inspiration", createUpdateOurInspiration);

// /**
//  * @swagger
//  * /api/OurInspiration/get-about-us:
//  *   get:
//  *     summary: Get the About Us section
//  *     tags: [About Us]
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 image:
//  *                   type: string
//  *                   description: URL of the image
//  *                 title:
//  *                   type: string
//  *                   description: Title of the About Us section
//  *                 sub_title:
//  *                   type: string
//  *                   description: Subtitle of the About Us section
//  *                 description:
//  *                   type: string
//  *                   description: Description of the About Us section
//  *       404:
//  *         description: Not found
//  */

/**
 * @swagger
 * /api/OurInspiration/get-about-us:
 *   get:
 *     summary: Get all About us
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: About Us retrieved successfully
 *       404:
 *         description: About Us not found
 */
ourInspirationRoutes.get("/get-our-inspiration/:id?", getOurInspiration);

export default ourInspirationRoutes;
