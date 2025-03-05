import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import Partners from "../sequelize/partnerSchema.js";
import { v4 as uuidv4 } from "uuid";
import {
  createQueryBuilder,
  deleteFilesInFolder,
  deleteRecord,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
const db = makeDb();

export const createUpdatePartner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const sections = JSON.parse(req.body.sections);
    if (sections.length === 0) {
      await deleteFilesInFolder("partners");
    }
    // const sectionsRegex = /^sections\[(\d+)\]\.media$/;
    // const sectionsRegex = /^sections\[(\d+)\]\[media\]$/;
    for (let i = 0; i < sections.length; i++) {
      const slide = sections[i];
      const file = req.files && req.files[`sections[${i}][media]`];

      let filepath = "";
      if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
        slide.media = await uploadFile("partners", file);
      }
    }
    let statusCode;
    req.body.sections = JSON.stringify(sections);
    if (id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(Partners, req.body);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(Partners, req.body);
      await db.query(query, values);
    }

    return res.status(statusCode).json({
      status: true,
      message: "Partners processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getPartners = asyncHandler(async (req, res) => {
  try {
    const query = `SELECT * FROM partner`;
    const getPartners = await db.query(query);

    if (getPartners.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Partner Not Found",
      });
    }

    getPartners[0].sections = JSON.parse(getPartners[0].sections);

    return res.status(200).json({
      status: true,
      data: getPartners[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deletePartner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPartner = await deleteRecord("partner", id);
    if (deletedPartner) {
      return res.status(200).json({
        status: true,
        message: "Partner deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Partner not found",
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
