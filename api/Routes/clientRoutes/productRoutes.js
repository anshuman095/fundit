import { Router } from "express";
import { getProducts } from "../../Controller/productController";

const productRoutes = Router();

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

export default productRoutes;
