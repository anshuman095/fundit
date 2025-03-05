import {
  createQueryBuilder,
  storeError,
  updateQueryBuilder,
  saveBase64Image,
  uploadFile,
  deleteFilesInFolder,
} from "../helper/general.js";
import Testimonial from "../sequelize/testimonialSchema.js";
import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
const db = makeDb();

export const createUpdateTestimonial = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const slides = JSON.parse(req.body.slides);
    if (slides.length === 0) {
      await deleteFilesInFolder("testimonial");
    }
    // const slidesRegex = /^slides\[(\d+)\]\.media$/;
    // const slidesRegex = /^slides\[(\d+)\]\[media\]$/;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const file = req.files && req.files[`slides[${i}][media]`];

      let filepath = "";
      if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
        slide.media = await uploadFile("testimonial", file);
      }
    }

    req.body.slides = JSON.stringify(slides);
    let statusCode;
    if (id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(Testimonial, req.body);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(Testimonial, req.body);
      await db.query(query, values);
    }

    return res.status(statusCode).json({
      status: true,
      message: "Testimonial processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getTestimonial = asyncHandler(async (req, res) => {
  try {
    const query = `SELECT * FROM testimonial`;
    let testimonials = await db.query(query);

    if (testimonials.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Testimonial Not Found",
      });
    }

    testimonials[0].slides = JSON.parse(testimonials[0].slides);

    return res.status(200).json({
      status: true,
      data: testimonials[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
