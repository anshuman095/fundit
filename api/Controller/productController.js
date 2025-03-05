import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import {
  createQueryBuilder,
  decodeData,
  deleteFilesInFolder,
  deleteRecord,
  encodedData,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import Product from "../sequelize/productSchema.js";

const db = makeDb();

// export const createUpdateProduct = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     const sections = JSON.parse(req.body.sections);
//     if (sections.length === 0) {
//       await deleteFilesInFolder("products");
//     }
//     // const sectionsRegex = /^sections\[(\d+)\]\.media$/;
//     // const sectionsRegex = /^sections\[(\d+)\]\[media\]$/;
//     for (let i = 0; i < sections.length; i++) {
//       const slide = sections[i];
//       const file = req.files && req.files[`sections[${i}][media]`];

//       let filepath = "";
//       if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
//         slide.media = await uploadFile("products", file);
//       }
//     }
//     req.body.sections = JSON.stringify(sections);
//     if (id) {
//       statusCode = 200;
//       const { query, values } = updateQueryBuilder(Product, req.body);
//       await db.query(query, values);
//     } else {
//       statusCode = 201;
//       const { query, values } = createQueryBuilder(Product, req.body);
//       await db.query(query, values);
//     }

//     return res.status(statusCode).json({
//       status: true,
//       message: "Product processed successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    // const { title, description } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("products", req.files.image);
    }
    // if (title) {
    //   req.body.title = JSON.stringify(await encodedData(req.body.title, "title"));
    // }
    // if (description) {
    //   req.body.description = JSON.stringify(await encodedData(req.body.description, "description"));
    // }
    if (id) {
      const { query, values } = updateQueryBuilder(Product, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Product updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Product, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Product created successfully",
      });
    }
  } catch (error) {
    storeError(req, res, error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.query.status;
    let where = [];
    if (status) {
      where.push(`status = '${status}'`);
    }
    if (id) {
      where.push(`id = ${id}`);
    }
    const query = `SELECT * FROM product ${where.length > 0 ? "WHERE " + where.join(" AND ") : ""}`;
    let products = await db.query(query);
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: id ? products[0] : products,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProductQuery = await deleteRecord("product", id);
    if (deleteProductQuery) {
      return res.status(200).json({
        status: true,
        message: "Product deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Product not found",
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
