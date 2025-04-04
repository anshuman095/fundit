import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import { getCustomDateRangeSubtitle, getDateRange, getPreviousDateRange, storeError } from "../helper/general.js";
import moment from "moment";

const db = makeDb();

export const getDonationsByDateRange = asyncHandler(async (req, res) => {
    try {
        let { year } = req.query;
        if (!year) {
            return res.status(400).json({ status: false, message: "Year is required." });
        }

        const query = `
            SELECT 
                MONTH(created_at) AS month,
                SUM(donation_amount) AS total_donation
            FROM donation
            WHERE deleted = 0 AND YEAR(created_at) = ${year}
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at);
        `;
        const donations = await db.query(query);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const response = months.map((month, index) => {
            const found = donations.find(d => d.month === index + 1);
            return {
                month,
                total_donation: `₹ ${found ? found.total_donation : 0}`
            };
        });
        return res.status(200).json({
            status: true,
            data: response,
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
    if (previous === 0) return current > 0 ? "100" : "0";
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(1)}`;
};

export const getSummary = asyncHandler(async (req, res) => {
    try {
        let { range } = req.query;
        let { start_date, end_date } = req.query;

        if (range !== "Custom Date") {
            ({ start_date, end_date } = getDateRange(range));
        }

        if (!start_date || !end_date) {
            return res.status(400).json({ status: false, message: "Start date and end date are required." });
        }

        const { previousStartDate, previousEndDate } = getPreviousDateRange(range, start_date, end_date);
        const subtitle = getCustomDateRangeSubtitle(start_date, end_date);

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
                    subtitle: subtitle,
                },
                active_visitors: {
                    title: "Active Visitors",
                    count: activeVisitorCount[0].count || 0,
                },
                total_staff: {
                    title: "Total Staff",
                    count: staffCount[0].count,
                    value: calculatePercentageChange(staffCount[0].count, prevStaffCount[0].count),
                    subtitle: subtitle,
                },
                total_volunteers: {
                    title: "Total Volunteers",
                    count: volunteerCount[0].count,
                    value: calculatePercentageChange(volunteerCount[0].count, prevVolunteerCount[0].count),
                    subtitle: subtitle,
                },
                total_donations: {
                    title: "Total Donations",
                    count: `₹ ${donationSum[0].total || 0}`,
                    value: calculatePercentageChange(donationSum[0].total || 0, prevDonationSum[0].total || 0),
                    subtitle: subtitle,
                },
                total_enquiries: {
                    title: "Total Enquiries",
                    count: enquiryCount[0].count,
                    value: calculatePercentageChange(enquiryCount[0].count, prevEnquiryCount[0].count),
                    subtitle: subtitle,
                },
            },
        });
    } catch (error) {
        storeError(error);
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
    try {
        const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
        const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");

        const previousMonthStart = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
        const previousMonthEnd = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");

        const [currentDonation, previousDonation] = await Promise.all([
            db.query(
                `SELECT SUM(donation_amount) as total FROM donation 
                 WHERE deleted = 0 AND created_at BETWEEN '${currentMonthStart}' AND '${currentMonthEnd}'`
            ),
            db.query(
                `SELECT SUM(donation_amount) as total FROM donation 
                 WHERE deleted = 0 AND created_at BETWEEN '${previousMonthStart}' AND '${previousMonthEnd}'`
            )
        ]);

        const currentTotal = currentDonation[0]?.total || 0;
        const previousTotal = previousDonation[0]?.total || 0;

        const percentageChange = calculatePercentageChange(currentTotal, previousTotal);

        return res.status(200).json({
            status: true,
            data: {
                current_month: moment().format("MMMM"), 
                current_total_donations: `₹ ${currentTotal}`,
                previous_month: moment().subtract(1, "months").format("MMMM"),
                previous_total_donations: `₹ ${previousTotal}`,
                value: percentageChange
            }
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({ status: false, message: error.message });
    }
});
