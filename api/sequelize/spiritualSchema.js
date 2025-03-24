import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Spiritual = sequelize.define(
  "spiritual",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the spiritual entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "spiritual",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information spiritual",
  }
);

// console.log(await Spiritual.sync({ alter: true }))
export default Spiritual;
