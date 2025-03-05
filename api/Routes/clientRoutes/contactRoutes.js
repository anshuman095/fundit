import { Router } from "express";
import { getContact } from "../../Controller/contactController";

const contactRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Operations related to contact
 */

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
