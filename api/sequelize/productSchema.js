import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the product (auto-incremented)",
    },
    // sections: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Image associated with the product",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Title of the product",
    },

    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the product",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Status of the product (1 for active, 0 for inactive)",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "product",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store product information",
  }
);

export default Product;
