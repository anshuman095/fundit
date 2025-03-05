import { Router } from "express";
import { createUpdateOurPartners, getOurPartners } from "../../Controller/ourPartnersController.js";

const ourPartnersRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Our Partners
 *   description: Operations related to our partners
 */

/**
 * @swagger
 * /api/ourPartners/create-update-our-partners:
 *   post:
 *     summary: Create or update a partner
 *     tags: [Our Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: The image URL or data for the partner
 *               title:
 *                 type: string
 *                 description: The title of the partner
 *               sub_title:
 *                 type: string
 *                 description: The subtitle of the partner
 *               description:
 *                 type: string
 *                 description: The description of the partner
 *               deleted:
 *                 type: integer
 *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
 *     responses:
 *       200:
 *         description: Partner created or updated successfully
 *       400:
 *         description: Bad request
 */
ourPartnersRoutes.post("/create-update-our-partners", createUpdateOurPartners);

/**
 * @swagger
 * /api/ourPartners/get-our-partners:
 *   get:
 *     summary: Get all partners
 *     tags: [Our Partners]
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 *       404:
 *         description: Partners not found
 */
ourPartnersRoutes.get("/get-our-partners", getOurPartners);

export default ourPartnersRoutes;
