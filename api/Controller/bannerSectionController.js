import asyncHandler from "express-async-handler";
import {
  checkUserExists,
  createQueryBuilder,
  generateInvoice,
  sendEmail,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
import BannerSection from "../sequelize/bannerSectionSchema.js";

const db = makeDb();

export const createUpdateBannerSection = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    let sections = [];

    if (req.body.sections) {
      sections = JSON.parse(req.body.sections);
    }

    if (req.files) {
      for (let i = 0; i < sections.length; i++) {
        const bannerSectionMediaFile = req.files[`sections[${i}][media]`];
        if (bannerSectionMediaFile && typeof bannerSectionMediaFile !== "string" && bannerSectionMediaFile !== null) {
          sections[i].media = await uploadFile("banner_section", bannerSectionMediaFile);
        }
      }
    }

    const dataToSave = {
      id: id || undefined,
      sections: JSON.stringify(sections)
    };
    let statusCode;
    if (dataToSave?.id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(BannerSection, dataToSave);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(BannerSection, dataToSave);
      await db.query(query, values);
    }

    return res.status(statusCode).json({
      status: true,
      message: "Banner Section entries processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getBannerSection = asyncHandler(async (req, res) => {
  try {
    let { title } = req.query
    let whereConditions = [];
    if (req.params?.id) {
      whereConditions.push(`id = ${req.params.id}`);
    }
    let whereClause = whereConditions?.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
    const getBannerSectionQuery = `SELECT * FROM banner_section ${whereClause}`;
    const getBannerSection = await db.query(getBannerSectionQuery);

    if (getBannerSection.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Banner Section Not Found",
      });
    }

    const filteredData = title
      ? getBannerSection.map(item => ({
        ...item,
        sections: item.sections.filter(section =>
          section.title.toLowerCase().includes(title.toLowerCase())
        )
      })).filter(item => item.sections.length > 0)
      : getBannerSection;

    if (filteredData.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Banner Section Not Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: filteredData[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
