import { Router } from "express";
import { validate } from "../../helper/general.js";
import { createPayment, getRazorpayCredential, handlePaymentCredential, verifyPayment } from "../../Controller/paymentController.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const payment = Router();

payment.post("/create-update-payment", handlePaymentCredential);

payment.get("/get-payment/:id?", getRazorpayCredential);

payment.post("/create-payment", createPayment);

payment.post("/verify-payment", verifyPayment);

export default payment;
