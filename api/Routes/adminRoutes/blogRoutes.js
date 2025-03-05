import { Router } from "express";
import { createUpdateBlog, getBlogs } from "../../Controller/blogController.js";
import { validate } from "../../helper/general.js";
import { blogSchema } from "../../helper/validations.js";

const blogRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Operations related to Blog settings and slides
 */

/**
 * @swagger
 * /api/blogs/create-update-blog:
 *   post:
 *     summary: Create or update a blog with settings and multiple slides
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "Blog ID for updating. If not provided, a new blog entry is created."
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
 *                     author:
 *                       type: string
 *                       description: "Author of the blog post"
 *                     title:
 *                       type: string
 *                       description: "Title of the blog post"
 *                     summary:
 *                       type: string
 *                       description: "Summary of the blog post"
 *                     publication_date:
 *                       type: string
 *                       format: date
 *                       description: "Publication date of the post in ISO format"
 *                     read_more_url:
 *                       type: string
 *                       format: uri
 *                       description: "URL to read more about the blog post"
 *                     hashtags:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: "Hashtags associated with the blog post"
 *                     media:
 *                       type: string
 *                       format: binary
 *                       description: "Media file (image or video) for the blog post"
 *     responses:
 *       200:
 *         description: Blog updated successfully
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
 *                   example: "Blog processed successfully"
 *       201:
 *         description: Blog created successfully
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
 *                   example: "Blog processed successfully"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

blogRoutes.post("/create-update-blog", createUpdateBlog);

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
