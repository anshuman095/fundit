import { Router } from "express";
import { createUpdateBookStore, getBookStore } from "../../Controller/bookStoreController.js";
import { validate } from "../../helper/general.js";
// import { BookStoreSchema } from "../../helper/validations.js";

const bookStoreRoutes = Router();

/**
 * @swagger
 * /api/bookStore/create-update-book-store:
 *   post:
 *     summary: Create or update the Book Store sections
 *     tags: [Book Store]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Book Store entry (for updates)
 *               sections:
 *                 type: json
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section": 1,"title": "Book Store 1", "description": "Description of Book Store 1"}, {"section": 2,"title": "Book Store 2", "description": "Description of Book Store 2"}]'
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
 *         description: Book store entries processed successfully
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
 *                   example: Book Store entries processed successfully.
 *       201:
 *         description: Book store entries processed successfully
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
 *                   example: Book Store entries processed successfully.
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

bookStoreRoutes.post("/create-update-book-store", createUpdateBookStore);

/**
 * @swagger
 * /api/bookStore/get-book-store:
 *   get:
 *     summary: Get all Book Store
 *     tags: [Book Store]
 *     responses:
 *       200:
 *         description: Book Store retrieved successfully
 *       404:
 *         description: Book Store not found
 */
bookStoreRoutes.get("/get-book-store/:id?", getBookStore);

export default bookStoreRoutes;
