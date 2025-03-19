import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Temple from "../sequelize/templeSchema.js";

const db = makeDb();

export const createUpdateTemple = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }

        const dataToSave = {
            id: id || undefined,
            sections: JSON.stringify(sections) 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Temple, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Temple, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Temple entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getTemple = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getTempleQuery = `SELECT * FROM temple ${whereClause}`;
        const getTemple = await db.query(getTempleQuery);

        if (getTemple.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Temple Not Found",
            });
        }

        const filteredData = title
            ? getTemple.map(item => ({
                ...item,
                sections: item.sections.filter(section => 
                    section.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.sections.length > 0) 
            : getTemple; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Temple Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: filteredData[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
