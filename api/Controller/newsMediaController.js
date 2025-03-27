import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import NewsMedia from "../sequelize/newsMediaSchema.js";

const db = makeDb();

export const createUpdateNewsMedia = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let news_media = [];

        if (req.body.news_media) {
            news_media = JSON.parse(req.body.news_media);
        }

        if (req.files) {
            for (let i = 0; i < news_media.length; i++) {
                const newsMediaMediaFile = req.files[`news_media[${i}][media]`];
                if (newsMediaMediaFile && typeof newsMediaMediaFile !== "string" && newsMediaMediaFile !== null) {
                    news_media[i].media = await uploadFile("news_media", newsMediaMediaFile);
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            news_media: JSON.stringify(news_media)
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(NewsMedia, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(NewsMedia, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "News Media entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getNewsMedia = asyncHandler(async (req, res) => {
    try {
        let { category } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getNewsMediaQuery = `SELECT * FROM news_media ${whereClause}`;
        const getNewsMedia = await db.query(getNewsMediaQuery);

        if (getNewsMedia.length === 0) {
            return res.status(404).json({
                status: false,
                message: "News Media Not Found",
            });
        }

        const filteredData = category && category !== 'All Categories'
            ? getNewsMedia.map(item => ({
                ...item,
                news_media: item.news_media.filter(news_media =>
                    news_media.category.toLowerCase().includes(category.toLowerCase())
                )
            })).filter(item => item.news_media.length > 0)
            : getNewsMedia;

        return res.status(200).json({
            status: true,
            data: filteredData.length > 0 ? filteredData[0]: { news_media: [] },
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
