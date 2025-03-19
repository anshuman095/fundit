import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import OurInspiration from "../sequelize/ourInspirationSchema.js";

const db = makeDb();

export const createUpdateOurInspiration = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
        
        // Handle file uploads for section assets
        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                // Handle main section asset
                const sectionAssetFile = req.files[`sections[${i}][asset]`];
                if (sectionAssetFile && typeof sectionAssetFile !== "string" && sectionAssetFile !== null) {
                    // The asset object in sections now needs to be replaced with the uploaded file path
                    sections[i].asset = await uploadFile("our_inspiration", sectionAssetFile);
                }
                
                // Handle media files for slider items
                if (sections[i].inspiration_slider && Array.isArray(sections[i].inspiration_slider)) {
                    for (let j = 0; j < sections[i].inspiration_slider.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][inspiration_slider][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            // Replace the media object with the uploaded file path
                            sections[i].inspiration_slider[j].media = await uploadFile("our_inspiration", sliderMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            sections: JSON.stringify(sections) // Make sure to stringify the sections for storage
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(OurInspiration, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(OurInspiration, dataToSave);
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

export const getOurInspiration = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getOurInspirationQuery = `SELECT * FROM our_inspiration ${whereClause}`;
        const getOurInspiration = await db.query(getOurInspirationQuery);

        if (getOurInspiration.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Our Inspiration Not Found",
            });
        }

        const filteredData = title
            ? getOurInspiration.map(item => ({
                ...item,
                sections: item.sections.filter(section => 
                    section.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.sections.length > 0) 
            : getOurInspiration; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Our Inspiration Not Found",
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
