import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import WhoAreWe from "../sequelize/whoAreWeSchema.js";
import {
  createQueryBuilder,
  decodeData,
  encodedData,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";

const db = makeDb();

export const createUpdateWhoAreWe = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    // const { description, title, sub_title } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("who_are_we", req.files.image);
    }
    // if (description)
    //   req.body.description = JSON.stringify(
    //     await encodedData(req.body.description, "description")
    //   );
    // if (title)
    //   req.body.title = JSON.stringify(
    //     await encodedData(req.body.title, "title")
    //   );

    // if (sub_title)
    //   req.body.sub_title = JSON.stringify(
    //     await encodedData(req.body.sub_title, "sub_title")
    //   );
    if (id) {
      const { query, values } = updateQueryBuilder(WhoAreWe, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Who are we updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(WhoAreWe, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Who are we created successfully",
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

export const getWhoAreWe = asyncHandler(async (req, res) => {
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
    const query = `SELECT * FROM who_are_we ${where.length > 0 ? "WHERE " + where.join(" AND ") : ""}`;
    let result = await db.query(query);
    // for (const data of getWhoAreWe) {
    //   data.description = JSON.parse(await decodeData(data.description, "description"));
    //   data.title = JSON.parse(await decodeData(data.title, "title"));
    //   data.sub_title = JSON.parse(await decodeData(data.sub_title, "sub_title"));
    // }

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Who are we Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: id ? result[0] : result,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
