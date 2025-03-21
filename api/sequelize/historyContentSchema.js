import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const HistoryContent = sequelize.define(
  "history_content",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the history content entry (auto-incremented)",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "history_content",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information history content",
  }
);

// console.log(await HistoryContent.sync({ alter: true }))
export default HistoryContent;
