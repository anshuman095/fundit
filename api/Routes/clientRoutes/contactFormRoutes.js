import { Router } from "express";
import { validate } from "../../helper/general";
import { contactFormSchema } from "../../helper/validations";
import { createUpdateContactForm } from "../../Controller/contactFormController";

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

export default contactFormRoutes;
