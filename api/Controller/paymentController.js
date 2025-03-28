import { makeDb } from "../db-config.js";
import { checkUserExists, createNotification, createQueryBuilder, getAdminData, hashPassword, storeError, updateQueryBuilder, uploadFile } from "../helper/general.js";
import SocialMediaSecret from "../sequelize/socialMediaSecretSchema.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../sequelize/userSchema.js";
import Payment from "../sequelize/paymentSchema.js";
import Donation from "../sequelize/donationSchema.js";
const db = makeDb();

export const handlePaymentCredential = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const { query, values } = updateQueryBuilder(SocialMediaSecret, req.body);
            await db.query(query, values);
        } else {
            const { query, values } = createQueryBuilder(SocialMediaSecret, req.body);
            await db.query(query, values);
        }
        res.status(200).json({ status: true, message: "Razorpay credentials saved" });
    } catch (error) {
        storeError(error);
        console.error("Error during Google login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const getRazorpayCredential = asyncHandler(async (req, res) => {
    try {
        let whereConditions = ["type = 'razorpay'"];
        if (req?.params?.id) {
            whereConditions.push(`id = ${req.params.id}`);
        }
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getRazorPayQuery = `SELECT * FROM social_media_secrets ${whereClause}`;
        const getRazorPay = await db.query(getRazorPayQuery);

        if (getRazorPay.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Razorpay Credential Not Found",
            });
        }

        return res.status(200).json({
            status: true,
            data: getRazorPay[0],
        });
    } catch (error) {
        storeError(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

export const createPayment = asyncHandler(async (req, res) => {
    try {
        const { id, aadhar_number, pan_number, donation_amount } = req.body;
        let whereConditions = ["type = 'razorpay'"];
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getRazorPayQuery = `SELECT id, razorpay_key_id, razorpay_key_secret FROM social_media_secrets ${whereClause}`;
        const getRazorPayCredential = await db.query(getRazorPayQuery);
        let userId = await checkUserExists(aadhar_number, pan_number);
        if (userId === null) {
            let data = {};
            data.username = req.body.full_name;
            data.full_name = req.body.full_name;
            data.email = req.body.email;
            data.mobile = req.body.mobile;
            data.password = await hashPassword("12345678");
            data.role_id = 2;
            data.address = req.body.address;
            data.type = "Donar";
            data.aadhar_number = req.body?.aadhar_number || "";
            data.pan_number = req.body?.pan_number || "";
            if (req.files) {
                for (const key of Object.keys(req.files)) {
                    const storePath = await uploadFile("donation", req.files[key]);
                    data[key] = storePath;
                }
            }
            const { query, values } = createQueryBuilder(User, data);
            const user = await db.query(query, values);
            userId = user?.insertId
        }
        let paymentData = {};
        paymentData.user_id = userId;
        const razorpay = new Razorpay({
            key_id: getRazorPayCredential[0].razorpay_key_id,
            key_secret: getRazorPayCredential[0].razorpay_key_secret,
        });
        const options = {
            amount: donation_amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
            notes: {
                userId,
            },
        };
        const order = await razorpay.orders.create(options);
        paymentData.payment_data = order;
        paymentData.order_id = order.id;
        paymentData.amount = donation_amount;
        paymentData.status = "pending";
        paymentData.currency = req.body?.currency;
        paymentData.donation_cause = req.body.donation_cause;
        await createPaymentData(paymentData);
        res.status(200).json({ status: true, message: "Order created", data: order });
    } catch (error) {
        storeError(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export async function createPaymentData(data) {
    if (data.payment_data) {
        data.payment_data = JSON.stringify(data.payment_data); 
    }
    const { query, values } = createQueryBuilder(Payment, data);
    await db.query(query, values);
}

export const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        let whereConditions = ["type = 'razorpay'"];
        let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
        const getRazorPayQuery = `SELECT id, razorpay_key_id, razorpay_key_secret FROM social_media_secrets ${whereClause}`;
        const getRazorPayCredential = await db.query(getRazorPayQuery);

        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", getRazorPayCredential[0].razorpay_key_secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            const updatePaymentQuery = `UPDATE payment 
              SET status = '${"failed"}', 
              payment_id = '${payment_id}', 
              signature = '${signature}' 
              WHERE order_id = '${order_id}'
            `;
            const updatePayment = await db.query(updatePaymentQuery);
            return res.status(400).json({ status: false, error: "Invalid Payment Signature" });
        }

        const updatePaymentQuery = `UPDATE payment 
          SET status = '${"paid"}', 
          payment_id = '${payment_id}', 
          signature = '${signature}' 
          WHERE order_id = '${order_id}'
        `;
        const updatePayment = await db.query(updatePaymentQuery);
        const paymentQuery = `SELECT * FROM payment WHERE order_id = '${order_id}'`;
        const paymentData = await db.query(paymentQuery);
        const userQuery = `SELECT * FROM users WHERE id = '${paymentData[0].user_id}'`;
        const userData = await db.query(userQuery);
        const donationData = {
            user_id: paymentData[0].user_id,
            full_name: userData[0].full_name,
            email: userData[0].email,
            mobile: userData[0].mobile,
            address: userData[0].address,
            aadhar_number: userData[0]?.aadhar_number || "",
            pan_number: userData[0]?.pan_number || "",
            aadhar_url: userData[0]?.aadhar_url || "",
            pan_url: userData[0]?.pan_url || "",
            donation_amount: paymentData[0].amount,
            donation_cause: paymentData[0].donation_cause,
            donation_type: "Online",
        }
        const { query, values } = createQueryBuilder(Donation, donationData);
        await db.query(query, values);
        const admin = await getAdminData();
        const data = {
            user_id: admin?.id,
            type: "Donation",
            message: `${userData[0].full_name} has donated ${paymentData[0].amount}`,
        }
        await createNotification(data);
        return res.status(200).json({ status: true, message: "Payment verified successfully" });
    } catch (error) {
        storeError(error);
        res.status(500).json({ status: false, error: error });
    }
});