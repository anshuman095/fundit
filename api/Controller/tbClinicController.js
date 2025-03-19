import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
} from "../helper/general.js";
import TbClinic from "../sequelize/TbClinicSchema.js";

const db = makeDb();

export const createUpdateTbClinic = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
        
        const dataToSave = {
            id: id || undefined,
            ...req.body,
            sections: sections ? JSON?.stringify(sections) : [] 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(TbClinic, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(TbClinic, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Tb Clinic entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getTbClinic = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getTbClinicQuery = `SELECT * FROM tb_clinic ${whereClause}`;
        const getTbClinic = await db.query(getTbClinicQuery);

        if (getTbClinic.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Tb Clinic Not Found",
            });
        }

        const filteredData = title
            ? getTbClinic.map(item => ({
                ...item,
                sections: item?.sections?.filter(section => 
                    section?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.sections?.length > 0) 
            : getTbClinic; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Tb Clinic Not Found",
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
