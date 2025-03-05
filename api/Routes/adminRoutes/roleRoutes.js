import { Router } from "express";
import { createUpdateRole, deleteRole, getRoles } from "../../Controller/roleController.js";
import { validate } from "../../helper/general.js";
import { roleSchema } from "../../helper/validations.js";
import { getPermissions, setPermission } from "../../Controller/permissionController.js";
import { checkPermission, verifyToken } from "../../helper/tokenVerify.js";

const roleRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Role
 *     description: Operations related to "Role" section
 */

/**
 * @swagger
 * /api/roles/create-update-role:
 *   post:
 *     summary: Create or update "Role" information
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: name of the role
 *               description:
 *                 type: string
 *                 description: The description of the section
 *               deleted:
 *                 type: integer
 *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
 *     responses:
 *       200:
 *         description: Role information created or updated successfully
 *       400:
 *         description: Bad request
 */
roleRoutes.post("/create-update-role", validate(roleSchema), verifyToken, checkPermission, createUpdateRole);

/**
 * @swagger
 * /api/roles/get-roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       404:
 *         description: Roles not found
 */
roleRoutes.get("/get-roles/:id?", getRoles);
roleRoutes.get("/get-permissions/:roleId", getPermissions);
roleRoutes.post("/set-permissions/:roleId", setPermission);

/**
 * @swagger
 * /api/roles/delete-role/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
roleRoutes.delete("/delete-role/:id", deleteRole);
export default roleRoutes;
