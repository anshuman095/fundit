import { Router } from "express";
import { createUpdateContact, deleteContact, getContact } from "../../Controller/contactController.js";
import { validate } from "../../helper/general.js";
import { contactSchema } from "../../helper/validations.js";

const contactRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Operations related to contact
 */

/**
 * @swagger
 * /api/contact/create-update-contact:
 *   post:
 *     summary: Create or update contact with sections and subsections
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Optional ID for updating an existing contact entry
 *               sections:
 *                 type: array
 *                 description: Array of sections containing descriptions and subsections
 *                 items:
 *                   type: object
 *                   properties:
 *                     section:
 *                       type: integer
 *                       description: section number
 *                       example: 1
 *                     description:
 *                       type: string
 *                       description: Description of the section
 *                       example: "Chapter 1 - Basics"
 *                     subsections:
 *                       type: array
 *                       description: Array of subsections within the section
 *                       items:
 *                         type: object
 *                         properties:
 *                           label_1:
 *                             type: string
 *                             description: Primary label for the subsection
 *                             example: "Introduction to Basics"
 *                           label_2:
 *                             type: string
 *                             description: Secondary label for the subsection
 *                             example: "An overview of basic concepts"
 *     responses:
 *       200:
 *         description: Contact created or updated successfully
 *       400:
 *         description: Bad request
 */

contactRoutes.post("/create-update-contact", createUpdateContact);

/**
 * @swagger
 * /api/contact/get-contact:
 *   get:
 *     summary: Get all contact
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 */
contactRoutes.get("/get-contact", getContact);
// contactRoutes.delete("/delete-contact/:id?", deleteContact);

export default contactRoutes;
