import QueryForm from "../sequelize/queryFormSchema.js";
import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
  createQueryBuilder,
  deleteRecord,
  generateReplyEmail,
  sendEmail,
  storeError,
  tableRecord,
  updateQueryBuilder,
} from "../helper/general.js";
const db = makeDb();

export const createUpdateQueryForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const { query, values } = updateQueryBuilder(QueryForm, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Query form updated successfully",
      });
    }
    const userExists = await tableRecord("email", req.body.email, "query_form");
    if (userExists.length > 0) {
      return res.status(409).json({
        status: false,
        message: "You already queried, Wait for response.",
      });
    }
    const { query, values } = createQueryBuilder(QueryForm, req.body);
    await db.query(query, values);
    return res.status(201).json({
      status: true,
      message: "Query form created successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getQueryForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let where = "";
    if (id) {
      where = `AND id = ${id}`;
    }
    const query = `SELECT * FROM query_form WHERE deleted = 0 ${where}`;
    const results = await db.query(query);
    if (results.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Query form not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: id ? results[0] : results,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteQueryForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQueryForm = await deleteRecord("query_form", id);
    if (deleteQueryForm) {
      return res.status(200).json({
        status: true,
        message: "Query form deleted successfully",
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const replyQueryForm = asyncHandler(async (req, res) => {
  try {
    const { id, reply } = req.body;
    const queryForm = await tableRecord("id", id, "query_form");
    if (queryForm.length == 0) {
      return res.status(409).json({
        status: false,
        message: "Query form not found.",
      });
    }

    const html = generateReplyEmail("query", queryForm[0].username, queryForm[0].query, reply);
    const email = queryForm[0].email;
    const response = await sendEmail("volthi@admin.com", email, "Response to Your Query", html);
    if (response.status) {
      console.log(response.message);
    } else {
      throw new Error(response.message);
    }
    const { query, values } = updateQueryBuilder(QueryForm, req.body);
    await db.query(query, values);
    return res.status(200).json({
      status: true,
      message: "Query form replied successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
