import {
  createQueryBuilder,
  storeError,
  updateQueryBuilder,
  saveBase64Image,
  uploadFile,
  deleteFilesInFolder,
} from "../helper/general.js";
import Blog from "../sequelize/blogSchema.js";
import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
const db = makeDb();

//OLD
// export const createUpdateBlog = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     const slides = JSON.parse(req.body.slides);
//     if (slides.length === 0) {
//       await deleteFilesInFolder("blog");
//     }
//     // const slidesRegex = /^slides\[(\d+)\]\.media$/;
//     // const slidesRegex = /^slides\[(\d+)\]\[media\]$/;
//     for (let i = 0; i < slides.length; i++) {
//       const slide = slides[i];
//       const file = req.files && req.files[`slides[${i}][media]`];

//       let filepath = "";
//       if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
//         slide.media = await uploadFile("blog", file);
//       }
//     }

//     req.body.slides = JSON.stringify(slides);
//     let statusCode;
//     if (id) {
//       statusCode = 200;
//       const { query, values } = updateQueryBuilder(Blog, req.body);
//       await db.query(query, values);
//     } else {
//       statusCode = 201;
//       const { query, values } = createQueryBuilder(Blog, req.body);
//       await db.query(query, values);
//     }

//     return res.status(statusCode).json({
//       status: true,
//       message: "Blog processed successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("blog", req.files.image);
    }

    if (id) {
      const { query, values } = updateQueryBuilder(Blog, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Blog updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Blog, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Blog created successfully",
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

export const getBlogs = asyncHandler(async (req, res) => {
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
    const query = `SELECT * FROM blog ${where.length > 0 ? "WHERE " + where.join(" AND ") : ""}`;
    let blogs = await db.query(query);

    if (blogs.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Blog Not Found",
      });
    }

    // blogs[0].slides = JSON.parse(blogs[0].slides);

    return res.status(200).json({
      status: true,
      data: id ? blogs[0] : blogs,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
