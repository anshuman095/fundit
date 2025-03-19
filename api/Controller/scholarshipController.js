import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Scholarship from "../sequelize/scholarshipSchema.js";

const db = makeDb();

export const createUpdateScholarship = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
        
        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                const scholarshipMediaFile = req.files[`sections[${i}][media]`];
                if (scholarshipMediaFile && typeof scholarshipMediaFile !== "string" && scholarshipMediaFile !== null) {
                    sections[i].media = await uploadFile("scholarship", scholarshipMediaFile);
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
            const { query, values } = updateQueryBuilder(Scholarship, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Scholarship, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Scholarship entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getScholarship = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getScholarshipQuery = `SELECT * FROM scholarship ${whereClause}`;
        const getScholarship = await db.query(getScholarshipQuery);

        if (getScholarship.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Scholarship Not Found",
            });
        }

        const filteredData = title
            ? getScholarship.map(item => ({
                ...item,
                sections: item.sections.filter(section => 
                    section.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.sections.length > 0) 
            : getScholarship; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Scholarship Not Found",
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
