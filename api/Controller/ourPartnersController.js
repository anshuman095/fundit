import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import OurPartners from "../sequelize/ourPartnersSchema.js";
import {
  createQueryBuilder,
  decodeData,
  encodedData,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
const db = makeDb();

export const createUpdateOurPartners = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const { title, description, sub_title } = req.body;
    if (title) {
      req.body.title = JSON.stringify(
        await encodedData(req.body.title, "title")
      );
    }
    if (description) {
      req.body.description = JSON.stringify(
        await encodedData(req.body.description, "description")
      );
    }
    if (sub_title) {
      req.body.sub_title = JSON.stringify(
        await encodedData(req.body.sub_title, "sub_title")
      );
    }
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("our_partners", req.files.image);
    }

    if (id) {
      const { query, values } = updateQueryBuilder(OurPartners, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Our partners updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(OurPartners, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Our partners created successfully",
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

export const getOurPartners = asyncHandler(async (req, res) => {
  try {
    const getOurPartnersQuery = `SELECT * FROM our_partners where deleted = 0`;
    const getOurPartners = await db.query(getOurPartnersQuery);
    for (const data of getOurPartners) {
      data.description = JSON.parse(
        await decodeData(data.description, "description")
      );
      data.title = JSON.parse(await decodeData(data.title, "title"));
      data.sub_title = JSON.parse(
        await decodeData(data.sub_title, "sub_title")
      );
    }
    return res.status(200).json({
      status: true,
      data: getOurPartners,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
