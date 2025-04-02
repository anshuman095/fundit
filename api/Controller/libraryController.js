import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import Library from "../sequelize/librarySchema.js";

const db = makeDb();

export const createUpdateLibrary = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let libraries = [];

        if (req.body.libraries) {
            libraries = JSON.parse(req.body.libraries);
        }

        if (req.files) {
            for (let i = 0; i < libraries.length; i++) {
                const libraryAssetFile = req.files[`libraries[${i}][asset]`];
                if (libraryAssetFile && typeof libraryAssetFile !== "string" && libraryAssetFile !== null) {
                    libraries[i].asset = await uploadFile("library", libraryAssetFile);
                }

                if (libraries[i].sub_section && Array.isArray(libraries[i].sub_section)) {
                    for (let j = 0; j < libraries[i].sub_section.length; j++) {
                        const librarySubSectionMediaFile = req.files[`libraries[${i}][sub_section][${j}][media]`];
                        if (librarySubSectionMediaFile && typeof librarySubSectionMediaFile !== "string" && librarySubSectionMediaFile !== null) {
                            libraries[i].sub_section[j].media = await uploadFile("library", librarySubSectionMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
            libraries: libraries ? JSON?.stringify(libraries) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Library, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Library, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Library entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getLibrary = asyncHandler(async (req, res) => {
    try {
        let { category } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getLibraryQuery = `SELECT * FROM library ${whereClause}`;
        const getLibrary = await db.query(getLibraryQuery);

        if (getLibrary.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Library Not Found",
            });
        }

        const filteredData = category
            ? getLibrary.map(item => ({
                ...item,
                libraries: item?.libraries?.filter(library => 
                    library?.category.toLowerCase().includes(category.toLowerCase())
              )
            })).filter(item => item?.libraries?.length > 0) 
            : getLibrary; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Library Not Found",
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
