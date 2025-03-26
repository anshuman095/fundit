import { Router } from "express";
import { createUpdateSidebar, getSidebar } from "../../Controller/sidebarController.js";
import { validate } from "../../helper/general.js";

const sidebar = Router();

/**
 * @swagger
 * /api/sidebar/create-update-sidebar:
 *   post:
 *     summary: Create or update the Sidebar
 *     tags: [Sidebar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Sidebar entry (for updates)
 *     responses:
 *       200:
 *         description: Sidebar entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: Sidebar entries processed successfully.
 *       201:
 *         description: Sidebar entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: Sidebar entries processed successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: Invalid request data.
 */

sidebar.post("/create-update-sidebar", createUpdateSidebar);

/**
 * @swagger
 * /api/sidebar/get-sidebar:
 *   get:
 *     summary: Get all Sidebar
 *     tags: [Sidebar]
 *     responses:
 *       200:
 *         description: Sidebar retrieved successfully
 *       404:
 *         description: Sidebar not found
 */
sidebar.get("/get-sidebar/:id?", getSidebar);

export default sidebar;
