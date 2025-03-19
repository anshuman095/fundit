import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import YouthForums from "../sequelize/youthForumsSchema.js";

const db = makeDb();

export const createUpdateYouthForums = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
        
        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].youth_sections && Array.isArray(sections[i].youth_sections)) {
                    for (let j = 0; j < sections[i].youth_sections.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][youth_sections][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            sections[i].youth_sections[j].media = await uploadFile("youth_forums", sliderMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            sections: JSON.stringify(sections) 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(YouthForums, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(YouthForums, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Youth Forums entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getYouthForums = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getYouthForumsQuery = `SELECT * FROM youth_forums ${whereClause}`;
        const getYouthForums = await db.query(getYouthForumsQuery);

        if (getYouthForums.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Youth Forums Not Found",
            });
        }

        const filteredData = title
            ? getYouthForums.map(item => ({
                ...item,
                sections: item.sections.filter(section => 
                    section.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.sections.length > 0) 
            : getYouthForums; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Youth Forums Not Found",
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