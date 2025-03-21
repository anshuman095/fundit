import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Footer from "../sequelize/footerSchema.js";

const db = makeDb();

export const createUpdateFooter = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (req.files) {
            for (const key of Object.keys(req.files)) {
                const storePath = await uploadFile("footer", req.files[key]);
                req.body[key] = storePath;
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Footer, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Footer, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Footer entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getFooter = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getFooterQuery = `SELECT * FROM footer ${whereClause}`;
        const getFooter = await db.query(getFooterQuery);

        if (getFooter.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Footer Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getFooter[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
