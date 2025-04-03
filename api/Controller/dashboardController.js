import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import { getDateRange, getPreviousDateRange } from "../helper/general.js";

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
            WHERE deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'
            ORDER BY created_at DESC
        `;
        const donations = await db.query(query);
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

const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(1)}%`;
};

export const getSummary = asyncHandler(async (req, res) => {
    try {
        let { range } = req.params;
        let { start_date, end_date } = req.query;

        if (range !== "Custom") {
            ({ start_date, end_date } = getDateRange(range));
        }

        if (!start_date || !end_date) {
            return res.status(400).json({ status: false, message: "Start date and end date are required." });
        }
        console.log('start_date=================', start_date);
        console.log('end_date=======================', end_date);

        const { previousStartDate, previousEndDate } = getPreviousDateRange(range, start_date, end_date);
        console.log('previousStartDate==============', previousStartDate);
        console.log('previousEndDate===================', previousEndDate);

        const [visitorCount, staffCount, volunteerCount, donationSum, enquiryCount, activeVisitorCount] = await Promise.all([
            db.query(`SELECT COUNT(*) as count FROM visitor WHERE deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'`),
            db.query(`SELECT COUNT(*) as count FROM users WHERE type = 'Staff' AND deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'`),
            db.query(`SELECT COUNT(*) as count FROM users WHERE type = 'Volunteer' AND deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'`),
            db.query(`SELECT SUM(donation_amount) as total FROM donation WHERE deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'`),
            db.query(`SELECT COUNT(*) as count FROM contact_form WHERE deleted = 0 AND created_at BETWEEN '${start_date}' AND '${end_date}'`),
            db.query(`SELECT COUNT(*) as count FROM visitor WHERE socket_id IS NOT NULL`),
        ]);

        const [prevVisitorCount, prevStaffCount, prevVolunteerCount, prevDonationSum, prevEnquiryCount] = await Promise.all([
            db.query(`SELECT COUNT(*) as count FROM visitor WHERE deleted = 0 AND created_at BETWEEN '${previousStartDate}' AND '${previousEndDate}'`),
            db.query(`SELECT COUNT(*) as count FROM users WHERE type = 'Staff' AND deleted = 0 AND created_at BETWEEN '${previousStartDate}' AND '${previousEndDate}'`),
            db.query(`SELECT COUNT(*) as count FROM users WHERE type = 'Volunteer' AND deleted = 0 AND created_at BETWEEN '${previousStartDate}' AND '${previousEndDate}'`),
            db.query(`SELECT SUM(donation_amount) as total FROM donation WHERE deleted = 0 AND created_at BETWEEN '${previousStartDate}' AND '${previousEndDate}'`),
            db.query(`SELECT COUNT(*) as count FROM contact_form WHERE deleted = 0 AND created_at BETWEEN '${previousStartDate}' AND '${previousEndDate}'`),
        ]);

        return res.status(200).json({
            status: true,
            data: {
                total_visitors: {
                    title: "Total Visitors",
                    count: visitorCount[0].count,
                    value: calculatePercentageChange(visitorCount[0].count, prevVisitorCount[0].count),
                    subtitle: range === "custom" ? "Custom Date Range" : `Last ${range}`,
                },
                active_visitors: {
                    title: "Active Visitors",
                    count: activeVisitorCount[0].count || 0,
                },
                total_staff: {
                    title: "Total Staff",
                    count: staffCount[0].count,
                    value: calculatePercentageChange(staffCount[0].count, prevStaffCount[0].count),
                    subtitle: range === "custom" ? "Custom Date Range" : `Last ${range}`,
                },
                total_volunteers: {
                    title: "Total Volunteers",
                    count: volunteerCount[0].count,
                    value: calculatePercentageChange(volunteerCount[0].count, prevVolunteerCount[0].count),
                    subtitle: range === "custom" ? "Custom Date Range" : `Last ${range}`,
                },
                total_donations: {
                    title: "Total Donations",
                    count: `₹ ${donationSum[0].total || 0}`,
                    value: calculatePercentageChange(donationSum[0].total || 0, prevDonationSum[0].total || 0),
                    subtitle: range === "custom" ? "Custom Date Range" : `Last ${range}`,
                },
                total_enquiries: {
                    title: "Total Enquiries",
                    count: enquiryCount[0].count,
                    value: calculatePercentageChange(enquiryCount[0].count, prevEnquiryCount[0].count),
                    subtitle: range === "Custom" ? "Custom Date Range" : `Last ${range}`,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

export const getRecentDonation = asyncHandler(async (req, res) => {
    try {
        const query = `
            SELECT * FROM donation
            WHERE deleted = 0
            ORDER BY created_at DESC
            LIMIT 5
        `;
        const recentDonations = await db.query(query);

        return res.status(200).json({
            status: true,
            data: recentDonations,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getDonationGrowth = asyncHandler(async (req, res) => {
});