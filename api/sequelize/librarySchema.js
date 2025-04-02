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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    libraries: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
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
