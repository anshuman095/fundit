import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const WhoAreWe = sequelize.define(
  "who_are_we",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the entry (auto-incremented)",
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image associated with the entry",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Title of the entry",
    },
    sub_title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Sub-title of the entry",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the entry",
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
    tableName: "who_are_we",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about who we are",
  }
);

export default WhoAreWe;
