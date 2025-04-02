import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
  createNotification,
  createQueryBuilder,
  deleteRecord,
  getAdminData,
  hashPassword,
  storeError,
  tableRecord,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import User from "../sequelize/userSchema.js";
import { Admin } from "../helper/constants.js";
import Donation from "../sequelize/donationSchema.js";
const db = makeDb();

/** Function to login and register new users  */

export const userLogin = asyncHandler(async (req, res) => {
  try {
    const { mobile, country } = req.body;

    /**Check that mobile number is already registered or not */

    const checkRegisteredUserQuery = `Select * from users WHERE phone = '${mobile}'`;
    const checkRegisteredUser = await db.query(checkRegisteredUserQuery);

    /**If given mobile number is registered then send otp */

    if (checkRegisteredUser.length > 0) {
      if (checkRegisteredUser[0].is_active == 0) {
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
    const { id, type } = req.body;

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    } else {
      req.body.password = await hashPassword("12345678");
    }
    if (!req.body.role_id) {
      req.body.role_id = 2;
    }
    if (!req.body.username) {
      req.body.username = req.body.full_name;
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

      const updateDonationQuery = `
        UPDATE donation 
        SET 
        full_name = ?, 
        email = ?, 
        mobile = ?, 
        address = ? 
        WHERE user_id = ?
      `;

      const donationValues = [req.body.full_name, req.body.email, req.body.mobile, req.body.address, id];
      await db.query(updateDonationQuery, donationValues);

      const getQuery = `SELECT username, full_name, email, image, address, mobile FROM users WHERE id = ${id}`;
      const user = await db.query(getQuery);
      return res.status(200).json({
        status: true,
        message: `${type ? `${type} updated successfully` : "User updated successfully"}`,
        data: user[0],
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
    if (req.body.aadhar_number && req.body.pan_number) {
      const existingUser = await db.query(
        `SELECT * FROM users WHERE aadhar_number = '${req.body.aadhar_number}' 
        OR pan_number = '${req.body.pan_number}'`
      );
      if (existingUser.length > 0) {
        return res.status(409).json({
          status: false,
          message: "User with this Aadhar or PAN number already exists",
        });
      }
    }
    const { query, values } = createQueryBuilder(User, req.body);
    await db.query(query, values);
    const admin = await getAdminData();
    const data = {
      user_id: admin?.id,
      subject: `${type ? `${type}` : "User"}`,
      message: `${req.body?.full_name} is added`,
    }
    await createNotification(data);
    return res.status(201).json({
      status: true,
      message: `${type ? `${type} created successfully` : "User created successfully"}`,
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
      const admin = await getAdminData();
      const data = {
        user_id: admin?.id,
        subject: "User",
        message: `User has been deleted.`
      }
      await createNotification(data);
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

export const getDonar = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    const { email, search } = req.query;
    let query = `SELECT users.id, users.username, users.full_name, users.email, users.mobile, users.status, users.type, users.aadhar_number, users.pan_number, users.address, users.role_id, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.deleted = 0 AND users.type = 'Donar' AND users.email <> '${Admin.email}'`;
    let countQuery = `SELECT COUNT(*) AS total FROM users WHERE users.deleted = 0 AND users.type = 'Donar' AND users.email <> '${Admin.email}'`;
    if (id) {
      query += ` AND users.id = ${id}`;
      countQuery += ` AND users.id = ${id}`;
    }
    if (email) {
      query += ` AND users.email = '${email}'`;
      countQuery += ` AND users.email = '${email}'`;
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      query += ` AND (
        LOWER(users.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(users.email) LIKE '%${lowerSearch}%' OR 
        LOWER(users.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(users.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.address) LIKE '%${lowerSearch}%'
      )`;

      countQuery += ` AND (
        LOWER(users.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(users.email) LIKE '%${lowerSearch}%' OR 
        LOWER(users.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(users.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.address) LIKE '%${lowerSearch}%'
      )`;
    }
    query += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const users = await db.query(query);
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;
    return res.status(200).json({
      status: true,
      data: users,
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

export const getVolunteer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    const { search } = req.query;
    let query = `SELECT users.id, users.username, users.full_name, users.email, users.mobile, users.status, users.type, users.aadhar_number, users.pan_number, users.address, users.role_id, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.deleted = 0 AND users.type = 'Volunteer' AND users.email <> '${Admin.email}'`;
    let countQuery = `SELECT COUNT(*) AS total FROM users WHERE users.deleted = 0 AND users.type = 'Volunteer' AND users.email <> '${Admin.email}'`;
    if (id) {
      query += ` AND users.id = ${id}`;
      countQuery += ` AND users.id = ${id}`;
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      query += ` AND (
        LOWER(users.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(users.email) LIKE '%${lowerSearch}%' OR 
        LOWER(users.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(users.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.address) LIKE '%${lowerSearch}%'
      )`;

      countQuery += ` AND (
        LOWER(users.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(users.email) LIKE '%${lowerSearch}%' OR 
        LOWER(users.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(users.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.address) LIKE '%${lowerSearch}%'
      )`;
    }
    query += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const users = await db.query(query);
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;
    return res.status(200).json({
      status: true,
      data: users,
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

export const getStaff = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    const { search } = req.query;
    let query = `SELECT users.id, users.username, users.full_name, users.email, users.mobile, users.status, users.type, users.aadhar_number, users.pan_number, users.address, users.role_id, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.deleted = 0 AND users.type = 'Staff' AND users.email <> '${Admin.email}'`;
    let countQuery = `SELECT COUNT(*) AS total FROM users JOIN roles ON users.role_id = roles.id
      WHERE users.deleted = 0 AND users.type = 'Staff' AND users.email <> '${Admin.email}'`;
    if (id) {
      query += ` AND users.id = ${id}`;
      countQuery += ` AND users.id = ${id}`;
    }
    if (search) {
      const lowerSearch = search.toLowerCase();

      let statusFilter = "";
      if (lowerSearch === "active") {
        statusFilter = "users.status = 1";
      } else if (["non-active", "non active", "nonactive"].includes(lowerSearch)) {
        statusFilter = "users.status = 0";
      }

      let searchConditions = `
        LOWER(users.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(users.email) LIKE '%${lowerSearch}%' OR 
        LOWER(users.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(users.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(users.address) LIKE '%${lowerSearch}%' OR
        LOWER(roles.name) LIKE '%${lowerSearch}%'
      `;

      if (statusFilter) {
        searchConditions += ` OR ${statusFilter}`;
      }

      query += ` AND (${searchConditions})`;
      countQuery += ` AND (${searchConditions})`;
    }
    query += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const users = await db.query(query);
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;
    return res.status(200).json({
      status: true,
      data: users,
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