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
import Fleet from "../sequelize/fleetSchema.js";
const db = makeDb();

export const createUpdateFleet = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    // const { title, description } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("fleets", req.files.image);
    }
    // if (title) {
    //   req.body.title = JSON.stringify(await encodedData(req.body.title, "title"));
    // }
    // if (description) {
    //   req.body.description = JSON.stringify(await encodedData(req.body.description, "description"));
    // }
    if (id) {
      const { query, values } = updateQueryBuilder(Fleet, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Fleet updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Fleet, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Fleet created successfully",
      });
    }
  } catch (error) {
    storeError(req, res, error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getFleets = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.query.status;
    let where = [];
    if (status) {
      where.push(`status = '${status}'`);
    }
    if (id) {
      where.push(`id = ${id}`);
    }
    const query = `SELECT * FROM fleet ${where.length > 0 ? "WHERE " + where.join(" AND ") : ""}`;
    let fleets = await db.query(query);
    if (fleets.length === 0) {
      return res.status(404).json({
        status: false,
        message: "FLeet Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: id ? fleets[0] : fleets,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteFleet = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFLeetQuery = await deleteRecord("fleet", id);
    if (deleteFLeetQuery) {
      return res.status(200).json({
        status: true,
        message: "FLeet deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "FLeet not found",
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
