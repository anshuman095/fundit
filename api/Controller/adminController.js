import asyncHandler from "express-async-handler";
import moment from "moment";
import bcrypt from "bcrypt";
import { makeDb } from "../db-config.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { generateOTP, generateOTPTemplate, hashPassword, sendEmail, storeError } from "../helper/general.js";
import { Admin } from "../helper/constants.js";
const db = makeDb();

/** Funtion to login admin panel  */

export const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    /**Check username is exist or not */

    const checkAdminQuery = `Select * from users WHERE email = '${username}'`;
    const checkAdmin = await db.query(checkAdminQuery);

    if (checkAdmin.length == 0) {
      return res.status(402).json({
        status: false,
        message: "User not found",
      });
    }

    if (checkAdmin[0].status == 0) {
      return res.status(402).json({
        status: false,
        message: "You are InActive. Please contact admin",
      });
    }

    const result = await bcrypt.compare(password, checkAdmin[0].password);
    if (result) {
      /**If Password is correct then create session or token */
      const token = jwt.sign(
        {
          email: checkAdmin[0].email,
          id: checkAdmin[0].id,
          role_id: checkAdmin[0].role_id,
        },
        process.env.JWT_KEY,
        { expiresIn: "30d" }
      );

      return res.status(200).json({
        status: true,
        token: token,
        data: checkAdmin[0],
        message: "Login successfully",
      });
    } else {
      return res.status(402).json({
        status: false,
        message: "Wrong login credentials",
      });
    }
  } catch (error) {
    /** Check if error is come then send that error to log file  */
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

/** Function to forgot password */

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    /**Check email is exist or not */

    const checkAdminQuery = `Select * from users WHERE email = '${email}'`;
    const checkAdmin = await db.query(checkAdminQuery);

    if (checkAdmin.length > 0) {
      const otp = generateOTP();
      const otpExpiry = moment().add(10, "minutes").format("YYYY-MM-DD HH:mm:ss");
      const html = generateOTPTemplate(otp);
      const response = await sendEmail("volthi@admin.com", email, "Forgot Password", html);
      if (response.status) {
        console.log(response.message);
      } else {
        throw new Error(response.message);
      }
      const updateUserOtpQuery = `UPDATE users SET otp = '${otp}', otp_expiry = '${otpExpiry}' WHERE email = '${email}'`;
      const updateUserOtp = await db.query(updateUserOtpQuery);
      return res.status(200).json({
        status: true,
        message: "Forgot otp send to your email",
        otp,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Check your email",
      });
    }
  } catch (error) {
    /** Check if error is come then send that error to log file  */
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const query = `SELECT * FROM users WHERE email = '${email}' AND otp = '${otp}'`;
    const result = await db.query(query);

    if (result.length == 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid otp or email",
      });
    }

    const otpExpiry = result[0].otp_expiry;
    if (moment().isAfter(otpExpiry)) {
      return res.status(400).json({
        status: false,
        message: "Otp is expired",
      });
    }

    const hash = await hashPassword(password);

    const updateAdminPasswordQuery = `UPDATE users SET password ='${hash}' , otp = null , otp_expiry = null WHERE email = '${email}'`;
    const updateAdminPassword = await db.query(updateAdminPasswordQuery);

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

/** Function to change password */

export const passwordChange = asyncHandler(async (req, res) => {
  try {
    const { email, old_password, new_password } = req.body;

    const checkAdminQuery = `Select * from users WHERE email = '${email}'`;
    const checkAdmin = await db.query(checkAdminQuery);

    if (checkAdmin.length == 0) {
      return res.status(402).json({
        status: false,
        message: "User not found",
      });
    }

    const result = await bcrypt.compare(old_password, checkAdmin[0].password);
    if (!result) {
      return res.status(402).json({
        status: false,
        message: "Password is incorrect",
      });
    }

    const hash = await hashPassword(new_password);

    const updateAdminPasswordQuery = `UPDATE users SET password ='${hash}' WHERE email = '${email}'`;
    const updateAdminPassword = await db.query(updateAdminPasswordQuery);
    if (updateAdminPassword) {
      return res.status(200).json({
        status: true,
        message: "Password updated successfully.",
      });
    } else {
      return res.status(402).json({
        status: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    /** Check if error is come then send that error to log file  */
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

/**Function to fetch users data */

export const usersData = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let where = "";

    if (id) {
      where = `AND users_view.id = ${id}`;
    }
    const fetchUserQuery = `SELECT * FROM users_view WHERE AND users_view.email <> '${Admin.email}' ${where}`;
    const fetchUser = await db.query(fetchUserQuery);
    return res.status(200).json({
      status: true,
      data: fetchUser,
    });
  } catch (error) {
    /** Check if error is come then send that error to log file  */
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getAdminDetails = asyncHandler(async (req, res) => {
  try {
    const fetchUserQuery = `SELECT email, mobile, asset FROM users WHERE id = 1`;
    const fetchDetail = await db.query(fetchUserQuery);
    return res.status(200).json({
      status: true,
      data: fetchDetail[0],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const getProfileQuery = `SELECT * FROM users_view WHERE users_view.id = ${req.user.id}`;
    const getProfile = await db.query(getProfileQuery);
    return res.status(200).json({
      status: true,
      data: getProfile[0],
    });
  } catch (error) {
    storeError(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
