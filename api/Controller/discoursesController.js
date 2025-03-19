import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Discourses from "../sequelize/discoursesSchema.js";

const db = makeDb();

export const createUpdateDiscourses = asyncHandler(async (req, res) => {
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
            const { query, values } = updateQueryBuilder(Discourses, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Discourses, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Discourses entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getDiscourses = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getDiscoursesQuery = `SELECT * FROM discourses ${whereClause}`;
        const getDiscourses = await db.query(getDiscoursesQuery);

        if (getDiscourses.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Discourses Not Found",
            });
        }

        const filteredData = title
            ? getDiscourses.map(item => ({
                ...item,
                sections: item.sections.filter(sections => 
                    sections.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.discourses.length > 0) 
            : getDiscourses; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Discourses Not Found",
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
