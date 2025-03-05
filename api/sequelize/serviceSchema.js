import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Services = sequelize.define(
  "services",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the service (auto-incremented)",
    },
    // sections: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image associated with the service",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Title of the service",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the service",
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
    tableName: "services",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store services information",
  }
);

export default Services;
