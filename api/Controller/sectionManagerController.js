import asyncHandler from "express-async-handler";
import SectionManager from "../sequelize/sectionManagerSchema.js";
import {
  createQueryBuilder,
  decodeData,
  deleteFilesInFolder,
  deleteRecord,
  encodedData,
  storeError,
  tableRecord,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
const db = makeDb();

export const createUpdateSectionManager = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const sections = JSON.parse(req.body.sections);
    if (sections.length === 0) {
      await deleteFilesInFolder("section_manager");
    }

    for (let i = 0; i < sections.length; i++) {
      const slide = sections[i];
      const file = req.files && req.files[`sections[${i}][media]`];

      let filepath = "";
      if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
        slide.media = await uploadFile("section_manager", file);
      }
    }
    let statusCode;
    console.log("sections: ", sections);
    req.body.sections = JSON.stringify(sections);
    if (id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(SectionManager, req.body);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(SectionManager, req.body);
      await db.query(query, values);
    }

    return res.status(statusCode).json({
      status: true,
      message: "Section manager entries processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getSectionManager = asyncHandler(async (req, res) => {
  try {
    const getSectionManagerQuery = `SELECT * FROM section_manager`;
    const getSectionManager = await db.query(getSectionManagerQuery);

    if (getSectionManager.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Section manager Not Found",
      });
    }

    getSectionManager.forEach((data) => {
      data.sections = JSON.parse(data.sections);
    });

    return res.status(200).json({
      status: true,
      data: getSectionManager,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
