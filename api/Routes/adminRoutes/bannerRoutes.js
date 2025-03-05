import { Router } from "express";
import { createUpdateBanner, getBanner } from "../../Controller/bannerController.js";

const bannerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Banner
 *   description: Operations related to banner
 */

/**
 * @swagger
 * /api/banner/create-update-banner:
 *   post:
 *     summary: Create or update a banner
 *     tags: [Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the banner (required for updating).
 *                 example: 1
 *               type:
 *                 type: string
 *                 description: The type of the banner (e.g., product, service).
 *                 example: product
 *               title:
 *                 type: string
 *                 description: The title of the banner.
 *                 example: "Summer Sale Banner"
 *               description:
 *                 type: string
 *                 description: The description of the banner.
 *                 example: "Get 50% off on all items this summer!"
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: The banner image file.
 *     responses:
 *       201:
 *         description: Banner created successfully
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
 *                   example: "Homepage Banner created successfully"
 *       200:
 *         description: Banner updated successfully
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
 *                   example: "Homepage Banner updated successfully"
 *       500:
 *         description: Internal server error
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
 *                   example: An error occurred
 */

bannerRoutes.post("/create-update-banner", createUpdateBanner);

/**
 * @swagger
 * /api/banner/get-banner:
 *   get:
 *     summary: Fetch banners
 *     tags: [Banner]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of the banner to filter by (e.g., product, service).
 *         example: product
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       description: Single banner (when `type` is provided).
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         type:
 *                           type: string
 *                           example: homepage
 *                         title:
 *                           type: string
 *                           example: "Homepage Banner"
 *                         description:
 *                           type: string
 *                           example: "This is the homepage banner."
 *                         banner_url:
 *                           type: string
 *                           example: "https://example.com/banner.jpg"
 *                     - type: array
 *                       description: List of banners (when `type` is not provided).
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           type:
 *                             type: string
 *                             example: homepage
 *                           title:
 *                             type: string
 *                             example: "Homepage Banner"
 *                           description:
 *                             type: string
 *                             example: "This is the homepage banner."
 *                           banner_url:
 *                             type: string
 *                             example: "https://example.com/banner.jpg"
 *       404:
 *         description: No banners found
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
 *                   example: "Product Banner Not Found"
 *       500:
 *         description: Internal server error
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
 *                   example: "An error occurred"
 */

bannerRoutes.get("/get-banner", getBanner);

export default bannerRoutes;
