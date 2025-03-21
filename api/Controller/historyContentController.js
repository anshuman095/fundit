import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
} from "../helper/general.js";
import HistoryContent from "../sequelize/historyContentSchema.js";

const db = makeDb();

export const createUpdateHistoryContent = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        let statusCode;
        if (id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(HistoryContent, req.body);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(HistoryContent, req.body);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "History content entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getHistoryContent = asyncHandler(async (req, res) => {
    try {
        const { search } = req.query;
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }

        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const query = `SELECT * FROM history_content ${whereClause}`;
        const getHistoryContent = await db.query(query);

        if (getHistoryContent.length === 0) {
            return res.status(404).json({
                status: false,
                message: "History Content Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getHistoryContent[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});