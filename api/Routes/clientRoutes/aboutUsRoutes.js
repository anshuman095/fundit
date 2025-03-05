import { Router } from "express";
import { getAboutUs } from "../../Controller/aboutUsController";

const aboutUsRoutes = Router();

/**
 * @swagger
 * /api/aboutUs/get-about-us:
 *   get:
 *     summary: Get all About us
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: About Us retrieved successfully
 *       404:
 *         description: About Us not found
 */
aboutUsRoutes.get("/get-about-us/:id?", getAboutUs);

export default aboutUsRoutes;
