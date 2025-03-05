import { Router } from "express";

import { validate } from "../../helper/general.js";
import { contactFormSchema, idSchema, replySchema } from "../../helper/validations.js";
import {
  createUpdateContactForm,
  deleteContactForm,
  getContactForm,
  replyContactForm,
} from "../../Controller/contactFormController.js";

const contactFormRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Contact Form
 *   description: Operations related to contact form
 */

/**
 * @swagger
 * /api/contact-form/create-update-contact-form:
 *   post:
 *     summary: Create or update a contact form entry
 *     description: Creates a new contact form entry if no ID is provided, or updates an existing entry if an ID is specified.
 *     tags: [Contact Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the contact form entry to update. If not provided, a new entry is created.
 *                 example: 123
 *               name:
 *                 type: string
 *                 description: The name of the user submitting the contact form.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *               message:
 *                 type: string
 *                 description: The message provided by the user.
 *                 example: I would like more information about your services.
 *     responses:
 *       201:
 *         description: Contact form created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact form created successfully"
 *       200:
 *         description: Contact form updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact form updated successfully"
 *       409:
 *         description: Conflict - Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You already contacted."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error while creating or updating contact form"
 */

contactFormRoutes.post("/create-update-contact-form", validate(contactFormSchema), createUpdateContactForm);

/**
 * @swagger
 * /api/contact-form/get-contact-form:
 *   get:
 *     summary: Get contact form details
 *     description: Fetch the contact form details by ID or get all contact forms if no ID is provided.
 *     tags: [Contact Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: The ID of the contact form to fetch. If not provided, returns all contact forms.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved contact form data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Contact form data (either all or specific form based on ID).
 *                   example:
 *                     id: 123
 *                     name: John Doe
 *                     email: johndoe@example.com
 *                     message: Inquiry about services.
 *       404:
 *         description: Contact form not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact form not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error while fetching contact form"
 */

contactFormRoutes.get("/get-contact-form/:id?", getContactForm);

/**
 * @swagger
 * /api/contact-form/delete-contact-form/{id}:
 *   delete:
 *     summary: Delete a contact form by ID
 *     description: Deletes a specific contact form based on the provided ID.
 *     tags: [Contact Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact form to delete.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully deleted the contact form.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact form deleted successfully"
 *       404:
 *         description: Contact form not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact form not found"
 *       500:
 *         description: Internal server error during deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error occurred during deletion"
 */

contactFormRoutes.delete("/delete-contact-form/:id", validate(idSchema, "params"), deleteContactForm);

contactFormRoutes.post("/response-contact-form", validate(replySchema), replyContactForm);

export default contactFormRoutes;
