import { Router } from "express";

import {
  createUpdateQueryForm,
  deleteQueryForm,
  getQueryForm,
  replyQueryForm,
} from "../../Controller/queryFormController.js";
import { validate } from "../../helper/general.js";
import { idSchema, queryFormSchema, replySchema } from "../../helper/validations.js";

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

/**
 * @swagger
 * /api/query-form/get-query-form:
 *   get:
 *     summary: Retrieve a query form or list of query forms
 *     tags: [QueryForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: The ID of the query form to retrieve. If not provided, all query forms will be retrieved.
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved query form(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       description: Details of a single query form
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         mobile:
 *                           type: string
 *                           example: +1234567890
 *                         query:
 *                           type: string
 *                           example: I need more information about your product.
 *                         product_id:
 *                           type: integer
 *                           example: 2
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-26T12:34:56Z
 *                     - type: array
 *                       items:
 *                         type: object
 *                         description: List of query forms
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: johndoe@example.com
 *                           phone:
 *                             type: string
 *                             example: +1234567890
 *                           query:
 *                             type: string
 *                             example: I need more information about your product.
 *                           product_id:
 *                             type: integer
 *                             example: 2
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-11-26T12:34:56Z
 *       404:
 *         description: Query form not found
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
 *                   example: Query form not found
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

queryFormRoutes.get("/get-query-form/:id?", getQueryForm);

/**
 * @swagger
 * /api/query-form/delete-query-form/{id}:
 *   delete:
 *     summary: Delete a query form
 *     tags: [QueryForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the query form to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Query form deleted successfully
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
 *                   example: Query form deleted successfully
 *       404:
 *         description: Query form not found
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
 *                   example: Query form not found
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

queryFormRoutes.delete("/delete-query-form/:id", validate(idSchema, "params"), deleteQueryForm);

queryFormRoutes.post("/response-query-form", validate(replySchema), replyQueryForm);
export default queryFormRoutes;
