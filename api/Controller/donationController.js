import asyncHandler from "express-async-handler";
import {
  checkUserExists,
  createNotification,
  createQueryBuilder,
  deleteRecord,
  generateDonationEmail,
  generateInvoice,
  getAdminData,
  hashPassword,
  sendEmail,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import Donation from "../sequelize/donationSchema.js";
import User from "../sequelize/userSchema.js";

const db = makeDb();

export const createUpdateDonation = asyncHandler(async (req, res) => {
  try {
    const { id, full_name, aadhar_number, pan_number, donation_amount, mobile } = req.body;
    if (req.files) {
      for (const key of Object.keys(req.files)) {
        const storePath = await uploadFile("donation", req.files[key]);
        req.body[key] = storePath;
      }
    }
    if (id) {
      const { query, values } = updateQueryBuilder(Donation, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: `Donation updated successfully`,
      });
    } else {
      if(req.body.user_id != "") {
        let query = `SELECT full_name FROM users WHERE id = '${req.body.user_id}'`;
        const result = await db.query(query);
        req.body.full_name = result[0]?.full_name;
      } else {
        let userId = await checkUserExists(aadhar_number, pan_number);
        if (userId === null) {
          req.body.username = req.body.full_name;
          req.body.password = await hashPassword("12345678");
          req.body.role_id = 2;
          req.body.type = "Donar";
          const { query, values } = createQueryBuilder(User, req.body);
          const user = await db.query(query, values);
          userId = user?.insertId
        }
        req.body.user_id = userId;
      }
      const { query, values } = createQueryBuilder(Donation, req.body);
      await db.query(query, values);

      const html = generateDonationEmail(full_name, donation_amount);
      const invoice = await generateInvoice(req.body);
      const email = req.body.email;
      await sendEmail("volthi@admin.com", email, "Donation Receipt", html, invoice);
      const admin = await getAdminData();
      const data = {
        user_id: admin?.id,
        subject: "Donation",
        message: `${req.body.full_name} has donated ${donation_amount}`,
      }
      await createNotification(data);
      return res.status(201).json({
        status: true,
        message: `Donation form submitted successfully`,
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

export const getDonation = asyncHandler(async (req, res) => {
  try {
    const roleId = req.user?.role_id;
    let type = req.query.type;
    const { search } = req.query;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    let whereConditions = ["deleted = 0"];
    if (type) {
      whereConditions.push(`type = '${type}'`);
    }

    if (req.params?.id) {
      whereConditions.push(`id = ${req.params.id}`);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      whereConditions.push(`(
        LOWER(donation.full_name) LIKE '%${lowerSearch}%' OR 
        LOWER(donation.email) LIKE '%${lowerSearch}%' OR 
        LOWER(donation.mobile) LIKE '%${lowerSearch}%' OR 
        LOWER(donation.aadhar_number) LIKE '%${lowerSearch}%' OR 
        LOWER(donation.pan_number) LIKE '%${lowerSearch}%' OR 
        LOWER(donation.address) LIKE '%${lowerSearch}%' OR
        LOWER(CAST(donation.donation_amount AS CHAR)) LIKE '%${lowerSearch}%' OR
        LOWER(donation.donation_cause) LIKE '%${lowerSearch}%' OR
        LOWER(donation.donation_type) LIKE '%${lowerSearch}%'
      )`);
    }
    let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";

    let selectFields = "*";

    if (roleId !== 1) {
      selectFields = `id, full_name, email, 
                      CONCAT(SUBSTRING(mobile, 1, LENGTH(mobile) - 4), '****') AS mobile, 
                      user_id, deleted, donation_type, anonymous, donation_amount, donation_cause`;
    }
    // CONCAT('******', SUBSTRING(mobile, -4)) AS mobile

    let query = `SELECT ${selectFields} FROM donation ${whereClause} LIMIT ${pageSize} OFFSET ${offset}`;
    let countQuery = `SELECT COUNT(*) AS total FROM donation ${whereClause}`;

    const result = await db.query(query);
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;

    return res.status(200).json({
      status: true,
      data: type ? result[0] : result,
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

export const deleteDonation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDonationQuery = await deleteRecord("donation", id);
    if (deleteDonationQuery) {
      const admin = await getAdminData();
      const data = {
        user_id: admin?.id,
        subject: "Donation",
        message: `Donation form has been deleted.`
      }
      await createNotification(data);
      return res.status(200).json({
        status: true,
        message: "Donation form deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Donation not found",
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