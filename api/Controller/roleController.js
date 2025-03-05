import asyncHandler from "express-async-handler";
import Role from "../sequelize/roleSchema.js";
import { makeDb } from "../db-config.js";
import { createQueryBuilder, deleteRecord, storeError, tableRecord, updateQueryBuilder } from "../helper/general.js";
const db = makeDb();

export const createUpdateRole = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      // if name is updated then check if role already exists with different id or not
      const role = await tableRecord("name", req.body.name, "roles");
      if (role.length > 0 && role[0].id !== id) {
        return res.status(400).json({
          status: false,
          message: "Role already exists",
        });
      }
      const { query, values } = updateQueryBuilder(Role, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Role updated successfully",
      });
    }

    const role = await tableRecord("name", req.body.name, "roles");
    if (role.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Role already exists",
      });
    }
    const { query, values } = createQueryBuilder(Role, req.body);
    await db.query(query, values);
    return res.status(201).json({
      status: true,
      message: "Role created successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getRoles = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const role = await tableRecord("id", id, "roles");
      return res.status(200).json({
        status: true,
        data: role,
      });
    }
    const getRolesQuery = `SELECT * FROM roles WHERE deleted = 0 AND name <> 'Admin'`;
    const getRoles = await db.query(getRolesQuery);
    return res.status(200).json({
      status: true,
      data: getRoles,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteRole = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRole = await deleteRecord("roles", id);
    if (deleteRole) {
      return res.status(200).json({
        status: true,
        message: "Role deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Role not found",
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
