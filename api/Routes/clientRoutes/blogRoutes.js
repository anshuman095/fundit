import { Router } from "express";
import { getBlogs } from "../../Controller/blogController";

const blogRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Operations related to Blog settings and slides
 */

/**
 * @swagger
 * /api/blogs/get-blogs:
 *   get:
 *     summary: Get all Blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 */
blogRoutes.get("/get-blogs/:id?", getBlogs);

export default blogRoutes;
