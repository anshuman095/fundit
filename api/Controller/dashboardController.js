import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";

const db = makeDb();

export const getDonationsByDateRange = asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({
                status: false,
                message: "Start date and end date are required.",
            });
        }

        const query = `
            SELECT * FROM donation
            WHERE deleted = 0 AND created_at BETWEEN ? AND ?
            ORDER BY created_at DESC
        `;

        const donations = await db.query(query, [start_date, end_date]);

        return res.status(200).json({
            status: true,
            data: donations,
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});