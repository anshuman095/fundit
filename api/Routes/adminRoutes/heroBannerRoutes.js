import { Router } from "express";
import {
  createUpdateHeroBannerSliderSettings,
  getHeroBannerSliderSettings,
  createUpdateHeroBannerSlides,
  getHeroBannerSlides,
  deleteHeroBannerSlides,
} from "../../Controller/heroBannerController.js";
import { checkPermission, verifyToken } from "../../helper/tokenVerify.js";

const heroBannerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Hero Banner
 *   description: Operations related to hero banner slider settings and slides
 */

/**
 * @swagger
 * /api/heroBanner/create-update-hero-banner-slider-settings:
 *   post:
 *     summary: Create or update hero banner slider settings
 *     tags: [Hero Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transition_type:
 *                 type: string
 *                 enum: [Slide, Fade, Dissolve]
 *               banner_height:
 *                 type: integer
 *               autoplay:
 *                 type: string
 *               pause_on_hover:
 *                 type: string
 *               navigation_arrows:
 *                 type: string
 *               pagination_dots:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings created or updated successfully
 *       400:
 *         description: Bad request
 */
heroBannerRoutes.post("/create-update-hero-banner-slider-settings", createUpdateHeroBannerSliderSettings);

/**
 * @swagger
 * /api/heroBanner/get-hero-banner-slider-settings:
 *   get:
 *     summary: Get all hero banner slider settings
 *     tags: [Hero Banner]
 *     responses:
 *       200:
 *         description: Hero banner slider settings retrieved successfully
 *       404:
 *         description: Settings not found
 */
heroBannerRoutes.get("/get-hero-banner-slider-settings/:id?", getHeroBannerSliderSettings);

/**
 * @swagger
 * /api/heroBanner/create-update-hero-banner-slides:
 *   post:
 *     summary: Create or update a hero banner with settings and multiple slides
 *     tags: [Hero Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "Hero banner ID for updating. If not provided, a new hero banner entry is created."
 *               transition_type:
 *                 type: string
 *                 enum: [Slide, Fade, Dissolve]
 *               transition_duration:
 *                 type: string
 *                 description: "Duration of the transition, e.g., '500ms'"
 *               banner_height:
 *                 type: integer
 *                 description: "Height of the banner in pixels"
 *               autoplay:
 *                 type: string
 *                 enum: [Yes, No]
 *               pause_on_hover:
 *                 type: string
 *                 enum: [Yes, No]
 *               navigation_arrows:
 *                 type: string
 *                 enum: [Yes, No]
 *               pagination_dots:
 *                 type: string
 *                 enum: [Yes, No]
 *               slides:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sequence:
 *                       type: integer
 *                       description: "Sequence number of the slide"
 *                     title:
 *                       type: string
 *                       description: "Title of the hero banner post"
 *                     description:
 *                       type: string
 *                       description: "Description of the hero banner post"
 *                     background_overlay_color:
 *                       type: string
 *                       description: "Background overlay color of the post"
 *                     background_overlay_percentage:
 *                       type: string
 *                       description: "Background overlay percentage of hero banner post"
 *                     media:
 *                       type: string
 *                       format: binary
 *                       description: "Media file (image or video) for the hero banner post"
 *     responses:
 *       200:
 *         description: Hero Banner updated successfully
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
 *                   example: "Hero Banner processed successfully"
 *       201:
 *         description: Hero Banner created successfully
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
 *                   example: "Hero Banner processed successfully"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
heroBannerRoutes.post("/create-update-hero-banner-slides", createUpdateHeroBannerSlides);

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

/**
 * @swagger
 * /api/heroBanner/delete-hero-banner-slides/{id}:
 *   delete:
 *     summary: Delete hero banner slide by ID
 *     tags: [Hero Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Slide deleted successfully
 *       404:
 *         description: Slide not found
 */
heroBannerRoutes.delete("/delete-hero-banner-slides/:id", deleteHeroBannerSlides);

export default heroBannerRoutes;
