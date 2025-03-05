import { Router } from "express";
import { getNavigationMenu } from "../../Controller/navigationMenuController.js";

const navigationMenuRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Navigation Menu
 *   description: Operations related to the navigation menu
 */

/**
 * @swagger
 * /api/navigationMenu/get-menu:
 *   get:
 *     summary: Get all navigation menus
 *     tags: [Navigation Menu]
 *     responses:
 *       200:
 *         description: Navigation menus retrieved successfully
 *       404:
 *         description: Navigation menus not found
 */
navigationMenuRoutes.get("/get-menu", getNavigationMenu);

export default navigationMenuRoutes;
