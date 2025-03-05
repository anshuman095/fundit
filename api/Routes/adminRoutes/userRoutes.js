import { Router } from "express";
import { createUpdateUser, deleteUser, getUsers, userLogin } from "../../Controller/userController.js";
import { validate } from "../../helper/general.js";
import { userSchema } from "../../helper/validations.js";

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /api/users/user-login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: johnDoe
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Pass123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid username or password
 */
userRoutes.post("/user-login", userLogin);

/**
 * @swagger
 * /api/users/create-update-user:
 *   post:
 *     summary: Create or update "User" information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username of the user
 *               full_name:
 *                 type: string
 *                 description: full name of the user
 *               email:
 *                 type: string
 *                 description: email of the user
 *               status:
 *                 type: integer
 *                 description: status of the user
 *               password:
 *                 type: string
 *                 description: password of the user
 *               role_id:
 *                 type: integer
 *                 description: role id of the user
 *               mobile:
 *                 type: string
 *                 description: mobile number of the user
 *               deleted:
 *                 type: integer
 *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
 *     responses:
 *       200:
 *         description: User information created or updated successfully
 *       400:
 *         description: Bad request
 */
userRoutes.post("/create-update-user", validate(userSchema), createUpdateUser);

/**
 * @swagger
 * /api/users/get-users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       404:
 *         description: Users not found
 */
userRoutes.get("/get-users/:id?", getUsers);

/**
 * @swagger
 * /api/users/delete-user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
userRoutes.delete("/delete-user/:id", deleteUser);

export default userRoutes;
