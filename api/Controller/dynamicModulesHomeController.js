import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import DynamicModulesHome from "../sequelize/dynamicModulesHomeSchema.js";

const db = makeDb();

export const createUpdateDynamicModulesHome = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        const dataToSave = {
            id: id || undefined,
            tables: JSON.stringify(req.body.tables) 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(DynamicModulesHome, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(DynamicModulesHome, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Dynamic Modules Home entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getDynamicModulesHome = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getDynamicModulesHomeQuery = `SELECT * FROM dynamic_modules_home ${whereClause}`;
        const getDynamicModulesHome = await db.query(getDynamicModulesHomeQuery);

        if (getDynamicModulesHome.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Dynamic Modules Home Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getDynamicModulesHome[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});


export const getDynamicModulesData = asyncHandler(async (req, res) => {
    try {
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getDynamicModulesHomeQuery = `SELECT * FROM dynamic_modules_home ${whereClause}`;
        const getDynamicModulesHome = await db.query(getDynamicModulesHomeQuery);

        if (getDynamicModulesHome.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Dynamic Modules Home Not Found",
            });
        }
        let id = getDynamicModulesHome[0]?.id;

        const dynamicData = [];
        for (const module of getDynamicModulesHome[0].tables) {
            const { title, tableName, sequence } = module;
            
            const tableDataQuery = `SELECT * FROM ${tableName} WHERE deleted = 0`;
            const tableData = await db.query(tableDataQuery);

            dynamicData.push({
                title: title,
                sequence: sequence,
                data: tableData
            });
        }

        return res.status(200).json({
            status: true,
            data: dynamicData,
            id: id,
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const updateDynamicModulesSequence = asyncHandler(async (req, res) => {
    try {
        let id = req.body.id;
        let newData = JSON.parse(req.body.data);
        const getDynamicModulesHomeQuery = `SELECT * FROM dynamic_modules_home WHERE id = '${id}'`;
        const getDynamicModulesHomeData = await db.query(getDynamicModulesHomeQuery);
        if (getDynamicModulesHomeData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Dynamic Modules Home Not Found",
            });
        }
        let existingTables = getDynamicModulesHomeData[0].tables;
        existingTables = existingTables.map(table => {
            let matchedItem = newData.find(item => item.title === table.title);
            if (matchedItem) {
                table.sequence = matchedItem.sequence;
            }
            return table;
        });
        existingTables.sort((a, b) => a.sequence - b.sequence); 
        const updateQuery = `UPDATE dynamic_modules_home SET tables = ? WHERE id = ?`;
        await db.query(updateQuery, [JSON.stringify(existingTables), id]);
        return res.status(200).json({
            status: true,
            message: "Dynamic Modules Home entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});