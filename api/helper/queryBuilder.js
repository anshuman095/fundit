// Import Sequelize models
import User from "../sequelize/userSchema.js";
import Notification from "../sequelize/notificationSchema.js";
import State from "../sequelize/StateSchema.js";
import City from "../sequelize/citySchema.js";
import Game from "../sequelize/gameSchema.js";
import Country from "../sequelize/countrySchema.js";
import { makeJoins, makeWhereCondition } from "./general.js";

// Create a query builder function for inserting records
export const createQueryBuilder = (model, requestBody) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }

  const columns = Object.keys(model.rawAttributes);

  const filteredColumns = columns.filter((column) => {
    return (
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== null &&
      requestBody[column] !== "" && // Exclude empty strings
      !(model.rawAttributes[column].allowNull === false && !requestBody[column]) // Check if required field is missing
    );
  });

  const placeholders = Array.from(
    { length: filteredColumns.length },
    () => `?`
  ).join(",");
  const columnNames = filteredColumns.join(", ");

  const query = `INSERT INTO ${model.tableName}(${columnNames}) VALUES (${placeholders})`;

  const values = filteredColumns.map((column) => requestBody[column]);

  return {
    query: query,
    values: values,
  };
};


// Create a query builder function for updating records
export const updateQueryBuilder = (model, requestBody) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }
  requestBody = JSON.pa
  console.log(requestBody);

  const columns = Object.keys(model.rawAttributes);

  // Identify primary keys and autoincrement keys
  const primaryKeyColumns = columns.filter(
    (column) =>
      model.rawAttributes[column].primaryKey ||
      model.rawAttributes[column].autoIncrement
  );

  // Filter columns to update, excluding primary keys and autoincrement keys
  const filteredColumns = columns.filter((column) => {
    return (
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== "" &&
      !model.rawAttributes[column].primaryKey &&
      !model.rawAttributes[column].autoIncrement
    );
  });

  // Generate SET part of the update query
  const setStatements = filteredColumns
    .map((column) => `${column} = ?`)
    .join(", ");

  // Generate WHERE part of the update query with primary keys
  const whereClauses = primaryKeyColumns
    .filter((column) => requestBody.hasOwnProperty(column))
    .map((column) => `${column} = ?`);

  if (whereClauses.length === 0) {
    throw new Error("No primary key value provided for the update operation.");
  }

  const whereClause = whereClauses.join(" AND ");

  const query = `UPDATE ${model.tableName} SET ${setStatements} WHERE ${whereClause}`;

  const values = filteredColumns.map((column) => requestBody[column]);

  // Append primary key values to the values array
  primaryKeyColumns.forEach((column) => {
    if (requestBody.hasOwnProperty(column)) {
      values.push(requestBody[column]);
    }
  });

  return {
    query: query,
    values: values,
  };
};

export const getQueryBuilder = (
  model,
  req,
  joins = [],
  attributes = "*",
  searchFields = [],
  id = null
) => {
  const {
    pageNumber,
    showAll,
    pageSizeNo,
    filterString = "",
    columnName = "id",
  } = req?.query || {};
  const {
    attributes: customAttributes = attributes,
    search: searchTerm = null,
  } = req?.query || {};

  const page = parseInt(pageNumber) || 1;
  const pageSize = parseInt(pageSizeNo) || 10;
  const offset = (page - 1) * pageSize;

  let query = `SELECT ${customAttributes} FROM ${model.tableName}`;

  // Apply joins if provided
  const joinClause = makeJoins(joins);
  query += joinClause;

  // Apply filtering based on filterString if available
  if (filterString?.trim() !== "") {
    const filter = JSON.parse(filterString);
    const filterConditions = Object.entries(filter)
      .map(([key, value]) => `${model.tableName}.${key} = '${value}'`)
      .join(" AND ");
    query += ` WHERE ${filterConditions}`;
  }

  // If id is provided, filter by id
  if (id !== null) {
    query += ` WHERE ${model.tableName}.${columnName} = ${id}`;
  }

  // Apply search if searchTerm and searchFields are provided
  if (searchTerm && searchFields.length > 0) {
    const searchConditions = searchFields
      .map((field) => `${field} LIKE '%${searchTerm}%'`)
      .join(" OR ");
    query += query.includes("WHERE")
      ? ` AND (${searchConditions})`
      : ` WHERE (${searchConditions})`;
  }

  // Apply pagination
  const pagination =
    showAll == "false" ? ` LIMIT ${pageSize} OFFSET ${offset}` : "";
  query += pagination;

  return query;
};


