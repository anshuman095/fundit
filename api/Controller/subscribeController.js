import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
} from "../helper/general.js";
import Subscribe from "../sequelize/subscribeSchema.js";

const db = makeDb();

export const createUpdateSubscribe = asyncHandler(async (req, res) => {
    try {
        const { id, email } = req.body;
        const checkEmailQuery = `SELECT id FROM subscribe WHERE email = ?`;
        const existingEmail = await db.query(checkEmailQuery, [email]);

        if (existingEmail.length > 0) {
            return res.status(400).json({
                status: false,
                message: "You have already subscribed.",
            });
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Subscribe, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Subscribe, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Subscribe entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getSubscribe = asyncHandler(async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = (page - 1) * pageSize;
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getSubscribeQuery = `SELECT * FROM subscribe ${whereClause}`;
        let countQuery = `SELECT COUNT(*) AS total FROM subscribe ${whereClause}`;
        
        const getSubscribe = await db.query(getSubscribeQuery);
        const totalCountResult = await db.query(countQuery);
        const total = totalCountResult[0]?.total || 0;

        return res.status(200).json({
            status: true,
            data: getSubscribe,
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
