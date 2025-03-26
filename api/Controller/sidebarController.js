import asyncHandler from "express-async-handler";
import {
  createQueryBuilder,
  storeError,
  updateQueryBuilder,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import Sidebar from "../sequelize/sidebarSchema.js";

const db = makeDb();

export const createUpdateSidebar = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const { query, values } = updateQueryBuilder(Sidebar, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: `Sidebar updated successfully`,
      });
    } else {
      const { query, values } = createQueryBuilder(Sidebar, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: `Sidebar created successfully`,
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

export const getSidebar = asyncHandler(async (req, res) => {
  try {
    let type = req.query.type;
    const { search } = req.query;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    let whereConditions = [];
    if (type) {
      whereConditions.push(`type = '${type}'`);
    }

    if (req.params?.id) {
      whereConditions.push(`id = ${req.params.id}`);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
    }
    let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";

    let query = `SELECT * FROM sidebar ${whereClause}`;
    let countQuery = `SELECT COUNT(*) AS total FROM sidebar WHERE parent_id IS NULL ${whereClause ? "AND " + whereClause : ""}`;

    const result = await db.query(query);
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;

    let sidebarMap = new Map();
    let parentModules = [];

    result?.forEach((item) => {
      let formattedItem = {
        ...item,
        submodules: [],
      };

      sidebarMap.set(item.id, formattedItem);

      if (item.parent_id === null) {
        parentModules.push(formattedItem);
      } else {
        if (sidebarMap.has(item.parent_id)) {
          sidebarMap.get(item.parent_id).submodules.push(formattedItem);
        } else {
          sidebarMap.set(item.parent_id, { submodules: [formattedItem] });
        }
      }
    });

    return res.status(200).json({
      status: true,
      data: parentModules,
      total: total,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});