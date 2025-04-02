import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import { deleteRecord, storeError } from "../helper/general.js";

const db = makeDb();

export const getNotification = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    let whereConditions = ["n.deleted = 0"];
    if (userId) {
      whereConditions.push(`n.user_id = ${userId}`);
    }

    let whereClause = whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}` : "";

    let query = `SELECT n.*, u.full_name AS user_name, u.image AS user_profile FROM notification n LEFT JOIN users u ON n.user_id = u.id ${whereClause} ORDER BY created_at DESC`;
    let countQuery = `SELECT COUNT(*) AS total FROM notification n ${whereClause}`;

    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);

    if (!isNaN(page) && !isNaN(pageSize) && page > 0 && pageSize > 0) {
      let offset = (page - 1) * pageSize;
      query += ` LIMIT ${pageSize} OFFSET ${offset}`;
    }

    const result = await db.query(query);
    const totalCountResult = await db.query(countQuery);
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

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  try {
    const { type } = req.body;
    if (type === "single") {
      const { id } = req.body;
      const checkQuery = `SELECT status FROM notification WHERE id = '${id}'`;
      const checkResult = await db.query(checkQuery);
      if (checkResult.length === 0) {
        return res.status(404).json({
          status: false,
          error: "Notification not found",
        });
      }

      if (checkResult[0].status === 'read') {
        return res.status(400).json({
          status: false,
          message: "Notification already marked as read",
        });
      }

      const updateNotificationQuery = `UPDATE notification SET status = 'read' WHERE id = '${id}'`;
      await db.query(updateNotificationQuery);

      return res.status(200).json({
        status: true,
        message: "Notification marked as read",
      });
    } else if (type === "all") {
      const userId = req.user?.id;
      let query = `UPDATE notification SET status = 'read' WHERE user_id = ${userId} AND status = 'unread'`;
      await db.query(query);

      return res.status(200).json({
        status: true,
        message: "All notifications marked as read",
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

export const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteScheduleQuoteQuery = await deleteRecord("notification", id);
    if (deleteScheduleQuoteQuery) {
      return res.status(200).json({
        status: true,
        message: "Notification deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Notification not found",
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

