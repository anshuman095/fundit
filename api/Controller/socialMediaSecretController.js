import asyncHandler from "express-async-handler";
import { createQueryBuilder, deleteRecord, getRedirectUrl, storeError, updateQueryBuilder } from "../helper/general.js";
import { makeDb } from "../db-config.js";
import SocialMediaSecret from "../sequelize/socialMediaSecretSchema.js";
const db = makeDb();

export const createUpdateSocialMediaSecret = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const type = req.body.type.toLowerCase();
    req.body.type = type;
    saveSecrets(req.body, id);
    return res.status(200).json({
      status: true,
      message: `Social media secret ${id ? "updated" : "created"} successfully`,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const saveSecrets = async (data, id) => {
  try {
    if (id) {
      data.id = id;
      const { query, values } = updateQueryBuilder(SocialMediaSecret, data);
      await db.query(query, values);
    } else {
      delete data.id;
      const { query, values } = createQueryBuilder(SocialMediaSecret, data);
      await db.query(query, values);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const getSocialMediaSecret = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const type = req.query.type ? req.query.type.toLowerCase() : "";

    const getSocialMediaSecret = await getSecrets(type, id);
    if (getSocialMediaSecret.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Social media secret not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: id || type ? getSocialMediaSecret[0] : getSocialMediaSecret,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getSecrets = async (type = null, id = null) => {
  try {
    let where = [];
    if (type) {
      where.push(`type = '${type}'`);
    }
    if (id) {
      where.push(`id = ${id}`);
    }

    const getSocialMediaSecretQuery = `SELECT * FROM social_media_secrets ${
      where.length > 0 ? "WHERE " + where.join(" AND ") : ""
    }`;
    const getSocialMediaSecret = await db.query(getSocialMediaSecretQuery);
    return getSocialMediaSecret;
  } catch (error) {
    throw error;
  }
};

export const deleteSocialMediaSecret = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSocialMediaSecret = await deleteRecord("social_media_secrets", id);
    if (deleteSocialMediaSecret) {
      return res.status(200).json({
        status: true,
        message: "Social media secret deleted successfully",
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

export const getPosts = asyncHandler(async (req, res) => {
  try {
    let type = req.query.type;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;

    let whereConditions = [];
    if (type) {
      whereConditions.push(`JSON_CONTAINS(type, '["${type}"]')`);
    }

    let whereClause = whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}` : "";

    let query = `SELECT * FROM post ${whereClause} ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    let countQuery = `SELECT COUNT(*) AS total FROM post ${whereClause}`;
    
    const totalCountResult = await db.query(countQuery);
    const total = totalCountResult[0]?.total || 0;
    const getPosts = await db.query(query);
    if (getPosts.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Posts Not Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: getPosts,
      total: total,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
