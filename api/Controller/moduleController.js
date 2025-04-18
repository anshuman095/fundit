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

      const buildTree = (parentId) => {
        return modules
          .filter((module) => module.parent_id === parentId)
          .map((module) => ({
            ...module,
            create: 1,
            read: 1,
            update: 1,
            delete: 1,
            children: buildTree(module.id), 
          }));
      };
      const result = buildTree(null);

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
