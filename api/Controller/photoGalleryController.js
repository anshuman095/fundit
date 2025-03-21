import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import PhotoGallery from "../sequelize/photoGallerySchema.js";

const db = makeDb();

export const createUpdatePhotoGallery = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let photo_gallery = [];

        if (id) {
            const [existingData] = await db.query(`SELECT photo_gallery FROM photo_gallery WHERE id = ?`, [id]);
            if (existingData?.photo_gallery) {
                try {
                    photo_gallery = existingData?.photo_gallery;
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        }

        if (req.files) {
            const photoGalleryFileKeys = Object.keys(req.files).filter(key => key.startsWith("photo_gallery["));
            for (const key of photoGalleryFileKeys) {
                const match = key.match(/\[([0-9]+)\]\[media\]/);
                if (!match) continue;
        
                const index = parseInt(match[1], 10); 
                const photoGalleryFile = req.files[key];
        
                if (photoGalleryFile && typeof photoGalleryFile !== "string" && photoGalleryFile !== null) {
                    if (!photo_gallery[index]) {
                        photo_gallery[index] = {}; 
                    }
                    photo_gallery[index].media = await uploadFile("photo_gallery", photoGalleryFile);
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
            photo_gallery: photo_gallery.length > 0 ? JSON.stringify(photo_gallery) : "[]",
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(PhotoGallery, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(PhotoGallery, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Photo Gallery entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getPhotoGallery = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getPhotoGalleryQuery = `SELECT * FROM photo_gallery ${whereClause}`;
        const getPhotoGallery = await db.query(getPhotoGalleryQuery);

        if (getPhotoGallery.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Photo Gallery Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getPhotoGallery[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
