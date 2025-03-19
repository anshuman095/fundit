import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Exhibition = sequelize.define(
  "exhibition",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the exhibition entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "exhibition",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information exhibition",
  }
);

// console.log(await Exhibition.sync({ alter: true }))
export default Exhibition;
