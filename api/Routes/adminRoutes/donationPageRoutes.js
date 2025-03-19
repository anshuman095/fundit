import { Router } from "express";
import { createUpdateDonationPage, getDonationPage } from "../../Controller/donationPageController.js";
import { validate } from "../../helper/general.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const donationPage = Router();

/**
 * @swagger
 * /api/donationPage/create-update-donation-page:
 *   post:
 *     summary: Create or update the DonationPage sections
 *     tags: [DonationPage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the DonationPage entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"category": "DonationPage 1", "description": "Description of DonationPage 1"}, {"category": "DonationPage 2", "description": "Description of DonationPage 2"}]'
 *               sections[0].asset:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].asset:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Donation Page entries processed successfully
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
 *                   example: Donation Page entries processed successfully.
 *       201:
 *         description: Donation Page entries processed successfully
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
 *                   example: Donation Page entries processed successfully.
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

donationPage.post("/create-update-donation-page", createUpdateDonationPage);

/**
 * @swagger
 * /api/donationPage/get-donation-page:
 *   get:
 *     summary: Get all DonationPage
 *     tags: [DonationPage]
 *     responses:
 *       200:
 *         description: Donation Page retrieved successfully
 *       404:
 *         description: Donation Page not found
 */
donationPage.get("/get-donation-page/:id?", getDonationPage);

export default donationPage;
