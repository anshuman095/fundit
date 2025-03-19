import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
    createQueryBuilder,
    storeError,
    updateQueryBuilder,
    uploadFile,
} from "../helper/general.js";
import BookStore from "../sequelize/bookStoreSchema.js";

const db = makeDb();

export const createUpdateBookStore = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        let sections = [];

        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }

        if (req.files) {
            for (let i = 0; i < sections.length; i++) {
                const sectionAssetFile = req.files[`sections[${i}][asset]`];
                if (sectionAssetFile && typeof sectionAssetFile !== "string" && sectionAssetFile !== null) {
                    sections[i].asset = await uploadFile("book_store", sectionAssetFile);
                }
                
                if (sections[i].book_store && Array.isArray(sections[i].book_store)) {
                    for (let j = 0; j < sections[i].book_store.length; j++) {
                        const sliderMediaFile = req.files[`sections[${i}][book_store][${j}][media]`];
                        if (sliderMediaFile && typeof sliderMediaFile !== "string" && sliderMediaFile !== null) {
                            sections[i].book_store[j].media = await uploadFile("book_store", sliderMediaFile);
                        }
                    }
                }
            }
        }

        const dataToSave = {
            id: id || undefined,
            sections: sections ? JSON?.stringify(sections) : [],
        };
        let statusCode;
        if (dataToSave?.id) {
            statusCode = 200;
            const { query, values } = updateQueryBuilder(BookStore, dataToSave);
            await db.query(query, values);
        } else {
            statusCode = 201;
            const { query, values } = createQueryBuilder(BookStore, dataToSave);
            await db.query(query, values);
        }

        return res.status(statusCode).json({
            status: true,
            message: "Book store entries processed successfully",
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const getBookStore = asyncHandler(async (req, res) => {
    try {
        let { title } = req.query
        let whereConditions = [];
        if (req.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getBookStoreQuery = `SELECT * FROM book_store ${whereClause}`;
        const getBookStore = await db.query(getBookStoreQuery);

        if (getBookStore.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Book Store Not Found",
            });
        }

        const filteredData = title
            ? getBookStore.map(item => ({
                ...item,
                sections: item?.sections?.filter(section => 
                    section?.title.toLowerCase().includes(title.toLowerCase())
              )
            })).filter(item => item?.sections?.length > 0) 
            : getBookStore; 

        if (filteredData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Book Store Not Found",
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
