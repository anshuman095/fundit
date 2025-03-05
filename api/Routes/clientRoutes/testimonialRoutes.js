import { Router } from "express";
import { getTestimonial } from "../../Controller/testimonialController";

const testimonialRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Testimonial
 *   description: Operations related to Testimonial settings and slides
 */

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
