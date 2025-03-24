import { makeDb } from "../db-config.js";
import { checkUserExists, createQueryBuilder, storeError, updateQueryBuilder } from "../helper/general.js";
import SocialMediaSecret from "../sequelize/socialMediaSecretSchema.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import User from "../sequelize/userSchema.js";
import Payment from "../sequelize/paymentSchema.js";
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
        res.status(200).json({ status: true, data: "Razorpay credentials saved" });
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
        console.log('userId:====================', userId);
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
            data.aadhar_number = req.body.aadhar_number;
            data.pan_number = req.body.pan_number;
            const { query, values } = createQueryBuilder(User, req.body);
            const user = await db.query(query, values);
            userId = user?.insertId
        }
        req.body.user_id = userId;
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
        console.log('order:=================================', order);
        req.body.payment_data = order;
        req.body.order_id = order.id;
        req.body.amount = order?.amount;
        req.body.status = "pending"
        await createPaymentData(req.body);
        res.status(200).json({ status: true, data: "Razorpay credentials saved" });
    } catch (error) {
        storeError(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export async function createPaymentData(data) {
    await Payment.create(data);
}

export const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        const getRazorPayQuery = `SELECT id, razorpay_key_id, razorpay_key_secret FROM social_media_secrets ${whereClause}`;
        const getRazorPayCredential = await db.query(getRazorPayQuery);

        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", getRazorPayCredential[0].razorpay_key_secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ error: "Invalid Payment Signature" });
        }

        // Update the payment status in your database
        const updatePaymentQuery = `UPDATE payment 
          SET status = '${"paid"}', 
          payment_id = '${payment_id}', 
          signature = '${signature}' 
          WHERE order_id = '${order_id}'
        `;
        const updatePayment = await db.query(updatePaymentQuery);
    } catch (error) {
        storeError(error);
        res.status(500).json({ error: error });
    }
});