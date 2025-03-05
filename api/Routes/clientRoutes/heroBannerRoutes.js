import { Router } from "express";
import { getHeroBannerSlides } from "../../Controller/heroBannerController";

const heroBannerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Hero Banner
 *   description: Operations related to hero banner slider settings and slides
 */

/**
 * @swagger
 * /api/heroBanner/get-hero-banner-slides:
 *   get:
 *     summary: Get all hero banner slides
 *     tags: [Hero Banner]
 *     responses:
 *       200:
 *         description: Hero banner slides retrieved successfully
 *       404:
 *         description: Slides not found
 */
heroBannerRoutes.get("/get-hero-banner-slides", getHeroBannerSlides);

export default heroBannerRoutes;
