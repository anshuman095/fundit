import { Router } from "express";
import { validate } from "../../helper/general.js";
import {
  deleteNotification,
  getNotification,
  markNotificationAsRead,
} from "../../Controller/notificationController.js";
import { verifyToken } from "../../helper/tokenVerify.js";

const notificationRoutes = Router();

/**
 * @swagger
 * /api/notification/get-notification:
 *   get:
 *     summary: Get all Notification
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 */

notificationRoutes.get("/get-notification/:id?", verifyToken, getNotification);

notificationRoutes.get("/mark-read/:id?", verifyToken, markNotificationAsRead);

notificationRoutes.delete("/delete-notification/:id", deleteNotification);

export default notificationRoutes;
