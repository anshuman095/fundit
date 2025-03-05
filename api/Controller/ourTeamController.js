import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import OurTeam from "../sequelize/ourTeamSchema.js";
import { createQueryBuilder, storeError, updateQueryBuilder, uploadFile } from "../helper/general.js";

const db = makeDb();

export const createUpdateOurTeam = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("our_team", req.files.image);
    }

    if (req.body.parent_id) {
      const selectQuery = `SELECT * FROM our_team WHERE id = ${req.body.parent_id}`;
      const parent = await db.query(selectQuery);
      if (parent.length == 0) {
        return res.status(404).json({ status: false, message: "Parent does not exist." });
      }
    }
    if (id) {
      const { query, values } = updateQueryBuilder(OurTeam, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Our Team updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(OurTeam, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Our Team created successfully",
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

export const getOurTeam = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.query.status;
    let where = [];
    if (status) {
      where.push(`tm.status = '${status}'`);
    }
    if (id) {
      where.push(`tm.id = ${id}`);
    }
    const query = `SELECT tm.id, tm.member_name, tm.image, tm.parent_id, p.member_name AS parent_name, tm.status FROM our_team tm LEFT JOIN our_team p ON tm.parent_id = p.id ${
      where.length > 0 ? "WHERE " + where.join(" AND ") : ""
    }`;
    let result = await db.query(query);

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Our Team Not Found",
      });
    }

    result = result.map((row) => {
      const { parent_name, parent_id, ...rest } = row;
      if (parent_id === null || parent_name === null) {
        return rest;
      }
      return { ...rest, parent_id, parent_name };
    });
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
