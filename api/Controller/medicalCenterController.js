import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import MedicalCenter from "../sequelize/medicalCenterSchema.js";

const db = makeDb();

export const createUpdateMedicalCenter = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];
        let slider = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
        
        if(req.body.slider) {
            slider = JSON.parse(req.body.slider);
        }

        if (req.files) {
            for (let i = 0; i < slider.length; i++) {
                const sliderMediaFile = req.files[`slider[${i}][media]`];
                if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                    slider[i].media = await uploadFile("medical_center", sliderMediaFile);
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
            sections: sections ? JSON?.stringify(sections) : [],
            slider: slider ? JSON?.stringify(slider) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(MedicalCenter, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(MedicalCenter, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Medical Center entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getMedicalCenter = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getMedicalCenterQuery = `SELECT * FROM medical_center ${whereClause}`;
        const getMedicalCenter = await db.query(getMedicalCenterQuery);

        if (getMedicalCenter.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Medical Center Not Found",
            });
        }

        const filteredData = title
            ? getMedicalCenter.map(item => ({
                ...item,
                sections: item?.sections?.filter(section => 
                    section?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.sections?.length > 0) 
            : getMedicalCenter; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Medical Center Not Found",
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
