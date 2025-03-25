import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Medical from "../sequelize/medicalSchema.js";

const db = makeDb();

export const createUpdateMedical = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }

        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].medical_sections && Array.isArray(sections[i].medical_sections)) {
                    for (let j = 0; j < sections[i].medical_sections.length; j++) {
                        const medicalSectionMediaFile = req.files[`sections[${i}][medical_sections][${j}][media]`];
                        if (medicalSectionMediaFile && typeof medicalSectionMediaFile !== "string" && medicalSectionMediaFile !== null) {
                            sections[i].medical_sections[j].media = await uploadFile("medical", medicalSectionMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
            sections: sections ? JSON?.stringify(sections) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Medical, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Medical, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Medical entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getMedical = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getMedicalQuery = `SELECT * FROM medical ${whereClause}`;
        const getMedical = await db.query(getMedicalQuery);

        if (getMedical.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Medical Not Found",
            });
        }

        const filteredData = title
            ? getMedical.map(item => ({
                ...item,
                sections: item?.sections?.filter(section =>
                    section?.title.toLowerCase().includes(title.toLowerCase())
                )
            })).filter(item => item?.sections?.length > 0)
            : getMedical;

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Medical Not Found",
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
