import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import PreFooter from "../sequelize/preFooterSchema.js";

const db = makeDb();

export const createUpdatePreFooter = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (req.files) {
            for (const key of Object.keys(req.files)) {
                const storePath = await uploadFile("pre_footer", req.files[key]);
                req.body[key] = storePath;
            }
        }

        let statusCode;
        if (id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(PreFooter, req.body);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(PreFooter, req.body);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Pre footer entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getPreFooter = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }

        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const query = `SELECT * FROM pre_footer ${whereClause}`;

        const getPreFooter = await db.query(query);

        return res.status(200).json({
            status: true,
            data: getPreFooter[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
