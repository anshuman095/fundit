import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Subscribe = sequelize.define(
  "subscribe",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the subscribe (auto-incremented)",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "subscribe",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information subscribe",
  }
);

// console.log(await Subscribe.sync({ alter: true }));
export default Subscribe;
