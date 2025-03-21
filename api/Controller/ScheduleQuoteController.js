import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    deleteRecord,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import ScheduleQuote from "../sequelize/scheduleQuoteSchema.js";

const db = makeDb();

export const createUpdateScheduleQuote = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (req.files) {
            for (const key of Object.keys(req.files)) {
                const storePath = await uploadFile("schedule_quote", req.files[key]);
                req.body[key] = storePath;
            }
        }

        let statusCode;
        if (id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(ScheduleQuote, req.body);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(ScheduleQuote, req.body);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Schedule quote entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getScheduleQuote = asyncHandler(async (req, res) => {
    try {
        const { search } = req.query;
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = (page - 1) * pageSize;
        let whereConditions = ["deleted = 0"];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        if (search) {
            const lowerSearch = search.toLowerCase();
            whereConditions.push(`(
              LOWER(schedule_quote.said_by) LIKE '%${lowerSearch}%' OR 
              LOWER(schedule_quote.reference) LIKE '%${lowerSearch}%'
            )`);
        }

        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const query = `SELECT * FROM schedule_quote ${whereClause}`;
        let countQuery = `SELECT COUNT(*) AS total FROM schedule_quote ${whereClause}`;

        const getScheduleQuote = await db.query(query);
        const totalCountResult = await db.query(countQuery);
        const total = totalCountResult[0]?.total || 0;

        return res.status(200).json({
            status: true,
            data: getScheduleQuote,
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

export const deleteScheduleQuote = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteScheduleQuoteQuery = await deleteRecord("schedule_quote", id);
    if (deleteScheduleQuoteQuery) {
      return res.status(200).json({
        status: true,
        message: "Schedule Quote deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Schedule Quote not found",
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