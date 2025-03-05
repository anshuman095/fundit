import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import {
  createQueryBuilder,
  decodeData,
  deleteFilesInFolder,
  deleteRecord,
  encodedData,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import Banner from "../sequelize/bannerSchema.js";

const db = makeDb();

export const createUpdateBanner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (req.files && req.files.banner) {
      req.body.banner = await uploadFile("banner", req.files.banner);
    }
    if (id) {
      const { query, values } = updateQueryBuilder(Banner, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: `${req.body.type} Banner updated successfully`,
      });
    } else {
      const { query, values } = createQueryBuilder(Banner, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: `${req.body.type} Banner created successfully`,
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getBanner = asyncHandler(async (req, res) => {
  try {
    let type = req.query.type;
    let where = "";
    if (type) {
      where = `WHERE type = '${type}'`;
    }
    const query = `SELECT * FROM banner ${where}`;
    const result = await db.query(query);
    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Product Banner Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: type ? result[0] : result,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
