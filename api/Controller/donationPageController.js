import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import DonationPage from "../sequelize/donationPageSchema.js";

const db = makeDb();

export const createUpdateDonationPage = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];
        let contribution_files = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }

        if (id) {
            const [existingData] = await db.query(`SELECT contribution_files FROM donation_page WHERE id = ?`, [id]);
            if (existingData?.contribution_files) {
                try {
                    contribution_files = existingData?.contribution_files;
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        }

        if (req.files) {
            const contributionFileKeys = Object.keys(req.files).filter(key => key.startsWith("contribution_files["));
            for (const key of contributionFileKeys) {
                const match = key.match(/\[([0-9]+)\]\[media\]/);
                if (!match) continue;
        
                const index = parseInt(match[1], 10); 
                const donationPageContributionFile = req.files[key];
        
                if (donationPageContributionFile && typeof donationPageContributionFile !== "string" && donationPageContributionFile !== null) {
                    if (!contribution_files[index]) {
                        contribution_files[index] = {}; 
                    }
                    contribution_files[index].media = await uploadFile("donation_page", donationPageContributionFile);
                }
            }

            if (req.files?.endowment_asset) {
                const endowmentFile = req.files.endowment_asset;
                req.body.endowment_asset = await uploadFile("donation_page", endowmentFile);
            }
        }

        const dataToSave = {
            id: id || undefined,
            ...req.body,
            contribution_files: contribution_files.length > 0 ? JSON.stringify(contribution_files) : "[]",
            sections: sections ? JSON?.stringify(sections) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(DonationPage, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(DonationPage, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Donation Page entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getDonationPage = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getDonationPageQuery = `SELECT * FROM donation_page ${whereClause}`;
        const getDonationPage = await db.query(getDonationPageQuery);

        if (getDonationPage.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Donation Page Not Found",
            });
        }

        const filteredData = title
            ? getDonationPage.map(item => ({
                ...item,
                libraries: item?.sections?.filter(section =>
                    section?.title.toLowerCase().includes(title.toLowerCase())
                )
            })).filter(item => item?.sections?.length > 0)
            : getDonationPage;

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Donation Page Not Found",
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
