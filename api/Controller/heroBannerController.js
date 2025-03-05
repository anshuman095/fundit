import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import HeroBannerSliderSettings from "../sequelize/heroBannerSliderSettingSchema.js";
import HeroBannerSlides from "../sequelize/heroBannerSlideSchema.js";
import {
  createQueryBuilder,
  deleteFilesInFolder,
  deleteRecord,
  storeError,
  updateQueryBuilder,
  uploadFile,
  saveBase64Image,
} from "../helper/general.js";

const db = makeDb();

export const createUpdateHeroBannerSliderSettings = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const { query, values } = updateQueryBuilder(HeroBannerSliderSettings, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Hero banner settings updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(HeroBannerSliderSettings, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Hero banner settings created successfully",
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

export const getHeroBannerSliderSettings = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let where = "";
    if (id) {
      where = `WHERE id = ${id}`;
    }
    const getHeroBannerSliderSettingsQuery = `SELECT * FROM hero_banner_slider_settings ${where}`;
    const getHeroBannerSliderSettings = await db.query(getHeroBannerSliderSettingsQuery);
    return res.status(200).json({
      status: true,
      data: getHeroBannerSliderSettings,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// export const createUpdateHeroBannerSlides = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (id) {
//       const { query, values } = updateQueryBuilder(HeroBannerSlides, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "Hero banner slides updated successfully",
//       });
//     } else {
//       const { query, values } = createQueryBuilder(HeroBannerSlides, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "Hero banner slides created successfully",
//       });
//     }
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateHeroBannerSlides = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    const slides = JSON.parse(req.body.slides);
    if (slides.length === 0) {
      await deleteFilesInFolder("hero_banner");
    }
    // const slidesRegex = /^slides\[(\d+)\]\.media$/;
    // const slidesRegex = /^slides\[(\d+)\]\[media\]$/;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const file = req.files && req.files[`slides[${i}][media]`];

      let filepath = "";
      if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
        slide.media = await uploadFile("hero_banner", file);
      }
    }

    req.body.slides = JSON.stringify(slides);
    let statusCode;
    if (id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(HeroBannerSlides, req.body);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(HeroBannerSlides, req.body);
      await db.query(query, values);
    }

    return res.status(statusCode).json({
      status: true,
      message: "Hero banner processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getHeroBannerSlides = asyncHandler(async (req, res) => {
  try {
    const getHeroBannerSlidesQuery = `SELECT * FROM hero_banner_slides`;
    const getHeroBannerSlides = await db.query(getHeroBannerSlidesQuery);
    if (getHeroBannerSlides.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Hero banner slides Not Found",
      });
    }

    getHeroBannerSlides[0].slides = JSON.parse(getHeroBannerSlides[0]?.slides || []);
    return res.status(200).json({
      status: true,
      data: getHeroBannerSlides[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteHeroBannerSlides = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteHeroBannerSlidesQuery = await deleteRecord("hero_banner_slides", id);
    if (deleteHeroBannerSlidesQuery) {
      return res.status(200).json({
        status: true,
        message: "Hero banner slides deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Hero banner slides not found",
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
