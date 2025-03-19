import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const YouthForums = sequelize.define(
  "youth_forums",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the youth forums entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "youth_forums",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information youth forums",
  }
);

// console.log(await YouthForums.sync({ alter: true }))
export default YouthForums;