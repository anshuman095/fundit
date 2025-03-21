import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
} from "../helper/general.js";
import VideoGallery from "../sequelize/VideoGallerySchema.js";

const db = makeDb();

export const createUpdateVideoGallery = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        const dataToSave = {
            id: id || undefined,
            ...req.body,
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(VideoGallery, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(VideoGallery, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Video Gallery entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getVideoGallery = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getVideoGalleryQuery = `SELECT * FROM video_gallery ${whereClause}`;
        const getVideoGallery = await db.query(getVideoGalleryQuery);

        if (getVideoGallery.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Video Gallery Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getVideoGallery[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
