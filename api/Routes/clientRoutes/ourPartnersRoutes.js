import { Router } from "express";
import { getOurPartners } from "../../Controller/ourPartnersController";

const ourPartnersRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Our Partners
 *   description: Operations related to our partners
 */

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
