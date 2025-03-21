import { Router } from "express";
import { createUpdateDynamicModulesHome, getDynamicModulesData, getDynamicModulesHome, updateDynamicModulesSequence } from "../../Controller/dynamicModulesHomeController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const dynamicModulesHome = Router();

/**
 * @swagger
 * /api/dynamicModulesHome/create-update-dynamic-modules-home:
 *   post:
 *     summary: Create or update the Dynamic Modules Home sections
 *     tags: [Dynamic Modules Home]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Dynamic Modules Home entry (for updates)
 *             required:
 *               - tables
 *     responses:
 *       200:
 *         description: Dynamic Modules Home entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Dynamic Modules Home entries processed successfully.
 *       201:
 *         description: Dynamic Modules Home entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Dynamic Modules Home entries processed successfully.
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
 *                   type: json
 *                   example: Invalid request data.
 */

dynamicModulesHome.post("/create-update-dynamic-modules-home", createUpdateDynamicModulesHome);

/**
 * @swagger
 * /api/dynamicModulesHome/get-dynamic-modules-home:
 *   get:
 *     summary: Get all Dynamic Modules Home
 *     tags: [Dynamic Modules Home]
 *     responses:
 *       200:
 *         description: Dynamic Modules Home retrieved successfully
 *       404:
 *         description: Dynamic Modules Home not found
 */
dynamicModulesHome.get("/get-dynamic-modules-home/:id?", getDynamicModulesHome);

dynamicModulesHome.get("/get-dynamic-modules-data/:id?", getDynamicModulesData);

dynamicModulesHome.post("/update-dynamic-modules-sequence", updateDynamicModulesSequence);

export default dynamicModulesHome;
