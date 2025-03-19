import { Router } from "express";
import { validate } from "../../helper/general.js";
import { donationSchema } from "../../helper/validations.js";
import {
  createUpdateDonation,
  deleteDonation,
  getDonation,
} from "../../Controller/donationController.js";
import { verifyToken } from "../../helper/tokenVerify.js";

const donationRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Donation Form
 *   description: Operations related to donation form
 */

/**
 * @swagger
 * /api/donation/create-update-donation:
 *   post:
 *     summary: Create or update a donation form entry
 *     description: Creates a new donation form entry if no ID is provided, or updates an existing entry if an ID is specified.
 *     tags: [Donation Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the donation form entry to update. If not provided, a new entry is created.
 *                 example: 123
 *               full_name:
 *                 type: string
 *                 description: The name of the user submitting the donation form.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *     responses:
 *       201:
 *         description: Donation form submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Donation form submitted successfully"
 *       200:
 *         description: Donation form updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Donation form updated successfully"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Error while creating or updating donation form"
 */

donationRoutes.post("/create-update-donation", validate(donationSchema), createUpdateDonation);

/**
 * @swagger
 * /api/donation/get-donation:
 *   get:
 *     summary: Get donation form details
 *     description: Fetch the donation form details by ID or get all donation forms if no ID is provided.
 *     tags: [Donation Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: The ID of the donation form to fetch. If not provided, returns all donation forms.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved donation form data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 data:
 *                   type: object
 *                   description: Donation form data (either all or specific form based on ID).
 *                   example:
 *                     id: 123
 *                     full_name: John Doe
 *                     email: johndoe@example.com
 *       404:
 *         description: Donation not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Error while fetching donation"
 */

donationRoutes.get("/get-donation/:id?", verifyToken, getDonation);

/**
 * @swagger
 * /api/donation/delete-donation-form/{id}:
 *   delete:
 *     summary: Delete a donation form by ID
 *     description: Deletes a specific donation form based on the provided ID.
 *     tags: [Donation Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the donation form to delete.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully deleted the donation form.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Donation form deleted successfully"
 *       404:
 *         description: Donation form not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Donation not found"
 *       500:
 *         description: Internal server error during deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pan_number:
 *                   type: integer
 *                   example: 12345678910
 *                 donation_amount:
 *                   type: integer
 *                   example: "Error occurred during deletion"
 */

donationRoutes.delete("/delete-donation/:id", deleteDonation);

export default donationRoutes;
