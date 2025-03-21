import { Router } from "express";
import { createUpdateDonationCause, getDonationCause } from "../../Controller/donationCauseController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const donationCause = Router();

/**
 * @swagger
 * /api/donationCause/create-update-donation-cause:
 *   post:
 *     summary: Create or update the Donation Cause sections
 *     tags: [Donation Cause]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Donation Cause entry (for updates)
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Donation Cause entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Donation Cause entries processed successfully.
 *       201:
 *         description: Donation Cause entries processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: json
 *                   example: Donation Cause entries processed successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: json
 *                   example: Invalid request data.
 */

donationCause.post("/create-update-donation-cause", createUpdateDonationCause);

/**
 * @swagger
 * /api/conationCause/get-donation-cause:
 *   get:
 *     summary: Get all Donation Cause
 *     tags: [DonationCause]
 *     responses:
 *       200:
 *         description: Donation Cause retrieved successfully
 *       404:
 *         description: Donation Cause not found
 */
donationCause.get("/get-donation-cause/:id?", getDonationCause);

export default donationCause;
