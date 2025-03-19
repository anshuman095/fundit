import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import ComputerCentre from "../sequelize/computerCentreSchema.js";

const db = makeDb();

export const createUpdateComputerCentre = asyncHandler(async (req, res) => {
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
                    sections[i].asset = await uploadFile("computer_centre", sectionAssetFile);
                }
                
                if (sections[i].computer_sections && Array.isArray(sections[i].computer_sections)) {
                    for (let j = 0; j < sections[i].computer_sections.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][computer_sections][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            sections[i].computer_sections[j].media = await uploadFile("computer_centre", sliderMediaFile);
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
            const { query, values } = updateQueryBuilder(ComputerCentre, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(ComputerCentre, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Computer center entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getComputerCentre = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getComputerCentreQuery = `SELECT * FROM computer_centre ${whereClause}`;
        const getComputerCentre = await db.query(getComputerCentreQuery);

        if (getComputerCentre.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Computer centre Not Found",
            });
        }

        const filteredData = title
            ? getComputerCentre.map(item => ({
                ...item,
                sections: item?.sections?.filter(section => 
                    section?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.sections?.length > 0) 
            : getComputerCentre; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Computer center Not Found",
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
