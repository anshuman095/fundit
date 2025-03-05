import { Router } from "express";
import { createUpdateProduct, deleteProduct, getProducts } from "../../Controller/productController.js";
import { productSchema } from "../../helper/validations.js";
import { validate } from "../../helper/general.js";

const productRoutes = Router();

// /**
//  * @swagger
//  * /api/product/create-update-product:
//  *   post:
//  *     summary: Create or update a product
//  *     tags: [Products]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 description: The image URL or data for the product
//  *               title:
//  *                 type: string
//  *                 description: The title of the product
//  *               description:
//  *                 type: string
//  *                 description: The description of the product
//  *               deleted:
//  *                 type: integer
//  *                 description: Indicator for soft deletion (0 for active, 1 for deleted)
//  *     responses:
//  *       200:
//  *         description: Product created or updated successfully
//  *       400:
//  *         description: Bad request
//  */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/product/create-update-product:
 *   post:
 *     summary: Create or update the Product sections
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the Product entry (for updates)
 *               sections:
 *                 type: string
 *                 description: Array of sections with title, description, and image URL (as JSON string)
 *                 example: '[{"section":1,"title": "product 1", "description": "Description of product 1"}, {"section":2,"title": "product 2", "description": "Description of product 2"}]'
 *               sections[0].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 1
 *               sections[1].image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for section 2
 *             required:
 *               - sections
 *     responses:
 *       200:
 *         description: Product section updated successfully
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
 *                   example: Product entries processed successfully.
 *       201:
 *         description: Product section created successfully
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
 *                   example: Product entries processed successfully.
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
 *                 message:
 *                   type: string
 *                   example: Invalid request data.
 */
productRoutes.post("/create-update-product", createUpdateProduct);

/**
 * @swagger
 * /api/product/get-product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       404:
 *         description: Products not found
 */
productRoutes.get("/get-product/:id?", getProducts);

// /**
//  * @swagger
//  * /api/product/delete-product/{id}:
//  *   delete:
//  *     summary: Delete a product by ID
//  *     tags: [Products]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: The ID of the product to delete
//  *     responses:
//  *       200:
//  *         description: Product deleted successfully
//  *       404:
//  *         description: Product not found
//  */
// productRoutes.delete("/delete-product/:id", deleteProduct);

export default productRoutes;
