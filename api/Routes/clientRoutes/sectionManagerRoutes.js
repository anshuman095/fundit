import { Router } from "express";
import { getSectionManager } from "../../Controller/sectionManagerController";

const sectionManagerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Section Manager
 *   description: Operations related to section manager
 */

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
