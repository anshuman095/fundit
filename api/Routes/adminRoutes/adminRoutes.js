import { Router } from "express";
import { adminLogin, forgotPassword, passwordChange, usersData, verifyOtp } from "../../Controller/adminController.js";
import { verifyToken } from "../../helper/tokenVerify.js";
import { validate } from "../../helper/general.js";
import { changePasswordSchema, forgotPasswordSchema } from "../../helper/validations.js";
const adminRoutes = Router();

/**
 * @swagger
 * /api/admin/admin_login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Admin username
 *               password:
 *                 type: string
 *                 description: Admin password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
adminRoutes.post("/admin_login", adminLogin);

/**
 * @swagger
 * /api/admin/forgot_password:
 *   post:
 *     summary: Forgot password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Email not found
 */
adminRoutes.post("/forgot_password", validate(forgotPasswordSchema), forgotPassword);
adminRoutes.post("/verify_otp", verifyOtp);
/**
 * @swagger
 * /api/admin/change_password:
 *   post:
 *     summary: Change password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Old password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
adminRoutes.post("/change_password", verifyToken, validate(changePasswordSchema), passwordChange);

/**
 * @swagger
 * /api/admin/users_details/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
adminRoutes.get("/users_details/:id", verifyToken, usersData);

/**
 * @swagger
 * /api/admin/users_details:
 *   get:
 *     summary: Get all user details
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Users not found
 */
adminRoutes.get("/users_details", verifyToken, usersData);

export default adminRoutes;
