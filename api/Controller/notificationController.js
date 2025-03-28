import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import Notification from "../sequelize/notificationSchema.js";
import { storeError, updateQueryBuilder } from "../helper/general.js";

const db = makeDb();

// Get Notifications for a User
export const getNotification = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    
    let query = `SELECT * FROM notification WHERE user_id = ? AND deleted = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    let countQuery = `SELECT COUNT(*) AS total FROM notification WHERE user_id = ? AND deleted = 0`;

    const result = await db.query(query, [userId, pageSize, offset]);
    const totalCountResult = await db.query(countQuery, [userId]);
    const total = totalCountResult[0]?.total || 0;

    return res.status(200).json({
      status: true,
      data: result,
      total: total,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Mark Notification as Read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { query, values } = updateQueryBuilder(Notification, { status: "read" }, `id = ${id}`);
    await db.query(query, values);

    return res.status(200).json({
      status: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Mark All Notifications as Read
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    let query = `UPDATE notification SET status = 'read' WHERE user_id = ? AND status = 'unread'`;
    await db.query(query, [userId]);

    return res.status(200).json({
      status: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Delete Notification
export const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let query = `UPDATE notification SET deleted = 1 WHERE id = ?`;
    await db.query(query, [id]);

    return res.status(200).json({
      status: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});


