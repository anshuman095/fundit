import { Router } from "express";
import { validate } from "../../helper/general.js";
import { createUpdateTestimonial, getTestimonial } from "../../Controller/testimonialController.js";

const testimonialRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Testimonial
 *   description: Operations related to Testimonial settings and slides
 */

/**
 * @swagger
 * /api/testimonial/create-update-testimonial:
 *   post:
 *     summary: Create or update a testimonial with settings and multiple slides
 *     tags: [Testimonial]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "Testimonial ID for updating. If not provided, a new testimonial entry is created."
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
 *                       description: "Sequence of the testimonial"
 *                     author:
 *                       type: string
 *                       description: "Author of the testimonial"
 *                     title:
 *                       type: string
 *                       description: "Title of the testimonial"
 *                     company:
 *                       type: string
 *                       description: "Company of the testimonial"
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: "Date of the testimonial in ISO format"
 *                     quote:
 *                       type: string
 *                       format: uri
 *                       description: "Quote of the testimonial"
 *                     rating:
 *                       type: number
 *                       description: "Rating of the testimonial"
 *                     media:
 *                       type: string
 *                       format: binary
 *                       description: "Media file (image or video) for the testimonial"
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
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
 *                   example: "Testimonial processed successfully"
 *       201:
 *         description: Testimonial created successfully
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
 *                   example: "Testimonial processed successfully"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

testimonialRoutes.post("/create-update-testimonial", createUpdateTestimonial);

/**
 * @swagger
 * /api/testimonial/get-testimonial:
 *   get:
 *     summary: Get all Testimonials
 *     tags: [Testimonial]
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *       404:
 *         description: Testimonial not found
 */
testimonialRoutes.get("/get-testimonial", getTestimonial);

export default testimonialRoutes;
