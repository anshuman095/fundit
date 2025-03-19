import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Temple = sequelize.define(
  "temple",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the temple entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "temple",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information temple",
  }
);

// console.log(await Temple.sync({ alter: true }))
export default Temple;
