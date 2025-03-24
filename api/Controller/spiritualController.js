import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Spiritual from "../sequelize/spiritualSchema.js";

const db = makeDb();

export const createUpdateSpiritual = asyncHandler(async (req, res) => {
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
                        const youthSectionMediaFile = req.files[`sections[${i}][youth_sections][${j}][media]`];
                        if (youthSectionMediaFile && typeof youthSectionMediaFile !== "string" && youthSectionMediaFile !== null) {
                            sections[i].youth_sections[j].media = await uploadFile("spiritual", youthSectionMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            sections: sections ? JSON?.stringify(sections) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Spiritual, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Spiritual, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Spiritual entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getSpiritual = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getSpiritualQuery = `SELECT * FROM spiritual ${whereClause}`;
        const getSpiritual = await db.query(getSpiritualQuery);

        if (getSpiritual.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Spiritual Not Found",
            });
        }

        const filteredData = title
            ? getSpiritual.map(item => ({
                ...item,
                sections: item?.sections?.filter(section =>
                    section?.title.toLowerCase().includes(title.toLowerCase())
                )
            })).filter(item => item?.sections?.length > 0)
            : getSpiritual;

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Spiritual Not Found",
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
