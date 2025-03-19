import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Exhibition from "../sequelize/exhibitionSchema.js";

const db = makeDb();

export const createUpdateExhibition = asyncHandler(async (req, res) => {
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
                    sections[i].asset = await uploadFile("exhibition", sectionAssetFile);
                }
                
                if (sections[i].exhibition_slider && Array.isArray(sections[i].exhibition_slider)) {
                    for (let j = 0; j < sections[i].exhibition_slider.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][exhibition_slider][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            sections[i].exhibition_slider[j].media = await uploadFile("exhibition", sliderMediaFile);
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
            const { query, values } = updateQueryBuilder(Exhibition, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Exhibition, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Our Inspiration entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getExhibition = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getExhibitionQuery = `SELECT * FROM exhibition ${whereClause}`;
        const getExhibition = await db.query(getExhibitionQuery);

        if (getExhibition.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Exhibition Not Found",
            });
        }

        const filteredData = title
            ? getExhibition.map(item => ({
                ...item,
                sections: item.sections.filter(section => 
                    section.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.sections.length > 0) 
            : getExhibition; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Exhibition Not Found",
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
