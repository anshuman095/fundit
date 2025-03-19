import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Library = sequelize.define(
  "library",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the library entry (auto-incremented)",
    },
    libraries: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "library",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information library",
  }
);

// console.log(await Library.sync({ alter: true }))
export default Library;
