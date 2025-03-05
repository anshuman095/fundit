import asyncHandler from "express-async-handler";
import {
  createQueryBuilder,
  deleteRecord,
  getRolePermission,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import Module from "../sequelize/moduleSchema.js";
const db = makeDb();

export const createUpdateModule = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    req.body.route = JSON.stringify(req.body.route);
    if (id) {
      const { query, values } = updateQueryBuilder(Module, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Module updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Module, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Module created successfully",
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

export const getModules = asyncHandler(async (req, res) => {
  try {
    const roleId = req.user.role_id;
    console.log("roleId: ", roleId);
    if (roleId == 1) {
      const excludedModules = ["Settings", "Roles & Permissions", "User Management"];
      const query = `SELECT * FROM module`;
      let modules = await db.query(query);
      if (modules.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Module Not Found",
        });
      }

      // if (roleId != 1) {
      //   modules = modules.filter((module) => !excludedModules.includes(module.name));
      // }
      const result = [];

      const map = {};

      modules.forEach((item) => {
        item.route = JSON.parse(item.route);
        if (item.parent_id === null) {
          item.create = 1;
          item.read = 1;
          item.update = 1;
          item.delete = 1;
          result.push(item);
          map[item.id] = item;
        } else {
          if (map[item.parent_id]) {
            if (!map[item.parent_id].children) {
              map[item.parent_id].children = [];
            }
            item.create = 1;
            item.read = 1;
            item.update = 1;
            item.delete = 1;
            map[item.parent_id].children.push(item);
          }
        }
      });

      return res.status(200).json({
        status: true,
        data: result,
      });
    } else {
      const result = await getRolePermission(roleId);
      return res.status(200).json({
        status: true,
        data: result,
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

export const deleteModule = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteModuleQuery = await deleteRecord("module", id);
    if (deleteModuleQuery) {
      return res.status(200).json({
        status: true,
        message: "Module deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Module not found",
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
