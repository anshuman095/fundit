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
        let libraries = [];

        if (req.body.libraries) {
            libraries = JSON.parse(req.body.libraries);
        }

        if (req.files) {
            for (let i = 0; i < libraries.length; i++) {
                const donationPageAssetFile = req.files[`libraries[${i}][asset]`];
                if (donationPageAssetFile && typeof donationPageAssetFile !== "string" && donationPageAssetFile !== null) {
                    libraries[i].asset = await uploadFile("donation_page", donationPageAssetFile);
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            libraries: libraries ? JSON?.stringify(libraries) : [],
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
                libraries: item?.libraries?.filter(DonationPage => 
                    DonationPage?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.libraries?.length > 0) 
            : getDonationPage; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "DonationPage Not Found",
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
