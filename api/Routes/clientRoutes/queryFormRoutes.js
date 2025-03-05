import { Router } from "express";
import { validate } from "../../helper/general";
import { queryFormSchema } from "../../helper/validations";
import { createUpdateQueryForm } from "../../Controller/queryFormController";

const queryFormRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: QueryForm
 *   description: Operations related to query form
 */

/**
 * @swagger
 * /api/query-form/create-update-query-form:
 *   post:
 *     summary: Create or update a query form
 *     tags: [QueryForm]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the query form (for update only)
 *                 example: 1
 *               username:
 *                 type: string
 *                 description: Name of the person making the query
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the person
 *                 example: johndoe@example.com
 *               mobile:
 *                 type: string
 *                 description: mobile number of the person
 *                 example: +1234567890
 *               query:
 *                 type: string
 *                 description: The query message
 *                 example: I need more information about your product.
 *               product_id:
 *                 type: integer
 *                 description: ID of the product related to the query
 *                 example: 2
 *             required:
 *               - name
 *               - email
 *               - message
 *               - product_id
 *     responses:
 *       201:
 *         description: Query form created successfully
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
 *                   example: Query form created successfully
 *       200:
 *         description: Query form updated successfully
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
 *                   example: Query form updated successfully
 *       409:
 *         description: Query already exists for the given email
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
 *                   example: You already queried.
 *       500:
 *         description: Internal server error
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
 *                   example: An error occurred
 */

queryFormRoutes.post("/create-update-query-form", validate(queryFormSchema), createUpdateQueryForm);

export default queryFormRoutes;
