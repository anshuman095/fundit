import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const History = sequelize.define(
  "history",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the history entry (auto-incremented)",
    },
    history: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "history",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information history",
  }
);

// console.log(await History.sync({ alter: true }))
export default History;
