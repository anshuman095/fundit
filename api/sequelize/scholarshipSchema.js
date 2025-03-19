import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Scholarship = sequelize.define(
  "scholarship",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the scholarship entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "scholarship",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information scholarship",
  }
);

// console.log(await Scholarship.sync({ alter: true }))
export default Scholarship;
