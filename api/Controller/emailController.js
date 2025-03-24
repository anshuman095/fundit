import { makeDb } from "../db-config.js";
import { createQueryBuilder, storeError, updateQueryBuilder } from "../helper/general.js";
import SocialMediaSecret from "../sequelize/socialMediaSecretSchema.js";
import asyncHandler from "express-async-handler";
const db = makeDb();

export const handleEmailCredential = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const { query, values } = updateQueryBuilder(SocialMediaSecret, req.body);
            await db.query(query, values);
        } else {
            const { query, values } = createQueryBuilder(SocialMediaSecret, req.body);
            await db.query(query, values);
        }
        res.status(200).json({ status: true, data: "Email credentials saved" });
    } catch (error) {
        storeError(error);
        console.error("Error during Google login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const getEmail = asyncHandler(async (req, res) => {
    try {
        let whereConditions = ["type = 'email'"];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getEmailQuery = `SELECT id, email_host, email_port, email_user, email_password, type FROM social_media_secrets ${whereClause}`;
        const getEmail = await db.query(getEmailQuery);

        if (getEmail.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Email Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getEmail[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});