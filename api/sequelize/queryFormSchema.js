import Product from "./productSchema.js";
import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const QueryForm = sequelize.define(
  "query_form",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the query form (auto-incremented)",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "id",
      },
      comment: "Product id of the query form",
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Name of the user",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Email address of the user",
    },
    mobile: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Mobile number of the user",
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Country of the user",
    },
    query: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Query of the user",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
    reply: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Response of the user",
    },
  },
  {
    tableName: "query_form",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information of query_form",
  }
);
export default QueryForm;
