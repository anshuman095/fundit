import { Router } from "express";
import { getBanner } from "../../Controller/bannerController";

const bannerRoutes = Router();

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
