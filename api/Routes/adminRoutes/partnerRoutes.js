import { Router } from "express";
import { createUpdatePartner, deletePartner, getPartners } from "../../Controller/partnerController.js";
import { validate } from "../../helper/general.js";
import { partnerSchema } from "../../helper/validations.js";

const partnerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Operations related to Partners
 */

/**
 * @swagger
 * /api/partner/create-update-partner:
 *   post:
 *     summary: Create or update the Partner sections
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Partner entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with partner_name, website_url, and image URL (as JSON string)
 *                 example: '[{"section": 1,"partner_name": "John Doe", "website_url": "https://example.com"}, {"section": 2,"title": "Alizeh", "website_url": "https://example.com"}]'
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
 *         description: Partner section updated successfully
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
 *                   example: Partner entries processed successfully.
 *       201:
 *         description: Partner section created successfully
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
 *                   example: Partner entries processed successfully.
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
partnerRoutes.post("/create-update-partner", createUpdatePartner);
partnerRoutes.get("/get-partner/:id?", getPartners);
partnerRoutes.delete("/delete-partner/:id", deletePartner);

export default partnerRoutes;
