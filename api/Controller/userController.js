import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
  createQueryBuilder,
  deleteRecord,
  hashPassword,
  storeError,
  tableRecord,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import User from "../sequelize/userSchema.js";
import { Admin } from "../helper/constants.js";
const db = makeDb();

/** Funtion to login and register new users  */

export const userLogin = asyncHandler(async (req, res) => {
  try {
    const { mobile, country } = req.body;

    /**Check that mobile number is already registered or not */

    const checkRegisterdUserQuery = `Select * from users WHERE phone = '${mobile}'`;
    const checkRegisterdUser = await db.query(checkRegisterdUserQuery);

    /**If given mobile number is registerd then send otp */

    if (checkRegisterdUser.length > 0) {
      if (checkRegisterdUser[0].is_active == 0) {
        return res.status(200).json({
          status: false,
          message: "Your account has been deactivated",
        });
      } else {
        /**Send new otp to users */

        const updateUserNewOtpQuery = `UPDATE users SET otp ='465789' WHERE phone = '${mobile}'`;
        const updateUserNewOtp = await db.query(updateUserNewOtpQuery);
      }
    } else {
      /**Create new users */

      const newUserInsertQuery = `INSERT INTO users(phone,otp,country) VALUES ('${mobile}','${123456}','${country}')`;
      const newUserInsert = await db.query(newUserInsertQuery);
    }
    return res.status(200).json({
      status: true,
      message: "Otp send successfully",
    });
  } catch (error) {
    /** Check if error is come then send that error to log file  */
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const createUpdateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("users", req.files.image);
    }
    if (req.files && req.files.asset) {
      req.body.asset = await uploadFile("users", req.files.asset);
    }
    if (id) {
      const { query, values } = updateQueryBuilder(User, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "User updated successfully",
      });
    }
    const userExists = await db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);
    if (userExists.length > 0) {
      if (userExists[0].deleted == 0) {
        return res.status(409).json({
          status: false,
          message: "User already exists",
        });
      } else {
        req.body.deleted = 0;
        req.body.id = userExists[0].id;
        const { query, values } = updateQueryBuilder(User, req.body);
        await db.query(query, values);
        return res.status(200).json({
          status: true,
          message: "User created successfully",
        });
      }
    }
    const { query, values } = createQueryBuilder(User, req.body);
    await db.query(query, values);
    return res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let query = `SELECT users.id, users.username, users.full_name, users.email, users.mobile, users.status, users.role_id, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.deleted = 0 AND users.email <> '${Admin.email}'`;
    if (id) {
      query += ` AND users.id = ${id}`;
    }
    const users = await db.query(query);
    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await deleteRecord("users", id);
    if (deleteUser) {
      return res.status(200).json({
        status: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "User not found",
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
