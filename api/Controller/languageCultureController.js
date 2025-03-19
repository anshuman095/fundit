import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import LanguageCulture from "../sequelize/languageCultureSchema.js";

const db = makeDb();

export const createUpdateLanguageCulture = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }

        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                const sectionAssetFile = req.files[`sections[${i}][asset]`];
                if (sectionAssetFile && typeof sectionAssetFile !== "string" && sectionAssetFile !== null) {
                    sections[i].asset = await uploadFile("language_culture", sectionAssetFile);
                }
                
                if (sections[i].slides && Array.isArray(sections[i].slides)) {
                    for (let j = 0; j < sections[i].slides.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][slides][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            sections[i].slides[j].media = await uploadFile("language_culture", sliderMediaFile);
                        }
                    }
                }

                if (sections[i].courses && Array.isArray(sections[i].courses)) {
                    for (let j = 0; j < sections[i].slides.length; j++) {
                        const courseMediaFile = req.files[`sections[${i}][courses][${j}][image]`];
                        if (courseMediaFile && typeof courseMediaFile !== "string" && courseMediaFile !== null) {
                            sections[i].courses[j].image = await uploadFile("language_culture", courseMediaFile);
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
            const { query, values } = updateQueryBuilder(LanguageCulture, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(LanguageCulture, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Language culture entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getLanguageCulture = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getLanguageCultureQuery = `SELECT * FROM language_culture ${whereClause}`;
        const getLanguageCulture = await db.query(getLanguageCultureQuery);

        if (getLanguageCulture.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Language Culture Not Found",
            });
        }

        const filteredData = title
            ? getLanguageCulture.map(item => ({
                ...item,
                sections: item?.sections?.filter(section => 
                    section?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.sections?.length > 0) 
            : getLanguageCulture; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Language Culture Not Found",
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
