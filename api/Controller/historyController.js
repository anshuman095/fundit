import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import History from "../sequelize/historySchema.js";

const db = makeDb();

export const createUpdateHistory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let history = [];

        if (req.body.history) {
            history = JSON.parse(req.body.history);
        }
        
        if (req.files) {
            for (let i = 0; i < history.length; i++) {
                const historyMediaFile = req.files[`history[${i}][media]`];
                if (historyMediaFile && typeof historyMediaFile !== "string" && historyMediaFile !== null) {
                    history[i].media = await uploadFile("history", historyMediaFile);
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            history: JSON.stringify(history) 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(History, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(History, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "History entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getHistory = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getHistoryQuery = `SELECT * FROM history ${whereClause}`;
        const getHistory = await db.query(getHistoryQuery);

        if (getHistory.length === 0) {
            return res.status(404).json({
                status: false,
                message: "History Not Found",
            });
        }

        const filteredData = title
            ? getHistory.map(item => ({
                ...item,
                history: item.history.filter(history => 
                    history.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.history.length > 0) 
            : getHistory; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "History Not Found",
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
