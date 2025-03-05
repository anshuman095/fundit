import { Router } from "express";
import { validate } from "../../helper/general.js";
import { createUpdateSectionManager, getSectionManager } from "../../Controller/sectionManagerController.js";
import { sectionManagerSchema } from "../../helper/validations.js";

const sectionManagerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Section Manager
 *   description: Operations related to section manager
 */
/**
 * @swagger
 * /api/section-manager/create-update-section-manager:
 *   post:
 *     summary: Create or update a Section Manager entry
 *     tags: [Section Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Optional ID for updating an existing Section Manager entry
 *               slides:
 *                 type: array
 *                 description: Array of slides containing sequence, title, and description
 *                 items:
 *                   type: object
 *                   properties:
 *                     sequence:
 *                       type: integer
 *                       description: Sequence number of the slide
 *                       example: 1
 *                     title:
 *                       type: string
 *                       description: Title of the slide
 *                       example: "Introduction"
 *                     description:
 *                       type: string
 *                       description: Detailed description of the slide
 *                       example: "This slide introduces the basics."
 *             required:
 *               - slides
 *     responses:
 *       200:
 *         description: Section Manager updated successfully
 *       201:
 *         description: Section Manager created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

sectionManagerRoutes.post("/create-update-section-manager", createUpdateSectionManager);

/**
 * @swagger
 * /api/section-manager/get-section-manager:
 *   get:
 *     summary: Get all section-manager
 *     tags: [Section Manager]
 *     responses:
 *       200:
 *         description: Section Manager retrieved successfully
 *       404:
 *         description: Section Manager not found
 */
sectionManagerRoutes.get("/get-section-manager", getSectionManager);

export default sectionManagerRoutes;
