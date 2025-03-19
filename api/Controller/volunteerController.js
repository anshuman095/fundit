import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
} from "../helper/general.js";
import Volunteer from "../sequelize/volunteerSchema.js";

const db = makeDb();

export const createUpdateVolunteer = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let volunteer = [];

        if (req.body.volunteer) {
            volunteer = JSON.parse(req.body.volunteer);
        }

        const dataToSave = {
            id: id || undefined,
            volunteer: JSON.stringify(volunteer) 
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(Volunteer, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(Volunteer, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Volunteer entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getVolunteer = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getVolunteerQuery = `SELECT * FROM volunteer ${whereClause}`;
        const getVolunteer = await db.query(getVolunteerQuery);

        if (getVolunteer.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Volunteer Not Found",
            });
        }

        const filteredData = title
            ? getVolunteer.map(item => ({
                ...item,
                volunteer: item.volunteer.filter(volunteer => 
                    volunteer.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item.volunteer.length > 0) 
            : getVolunteer; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Volunteer Not Found",
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
