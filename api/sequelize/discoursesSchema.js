import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Discourses = sequelize.define(
  "discourses",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the discourses entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "discourses",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information discourses",
  }
);

// console.log(await Discourses.sync({ alter: true }))
export default Discourses;
