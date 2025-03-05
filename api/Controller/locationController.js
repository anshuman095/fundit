import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import Locations from "../sequelize/locationSchema.js";
import { createQueryBuilder, deleteRecord, storeError, updateQueryBuilder } from "../helper/general.js";

const db = makeDb();

export const createUpdateLocation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    req.body.sections = JSON.stringify(req.body.sections);

    if (id) {
      const { query, values } = updateQueryBuilder(Locations, req.body);
      await db.query(query, values);
    } else {
      const { query, values } = createQueryBuilder(Locations, req.body);
      await db.query(query, values);
    }

    return res.status(200).json({
      status: true,
      message: "Location processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getLocations = asyncHandler(async (req, res) => {
  try {
    const getLocationsQuery = `SELECT * FROM locations`;
    const getLocations = await db.query(getLocationsQuery);
    if (getLocations.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Locations not found",
      });
    }
    getLocations.map((location) => {
      location.sections = JSON.parse(location.sections);
    });
    return res.status(200).json({
      status: true,
      data: getLocations[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteLocations = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteLocation = await deleteRecord("locations", id);
    if (deleteLocation) {
      return res.status(200).json({
        status: true,
        message: "Location deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Location not found",
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
