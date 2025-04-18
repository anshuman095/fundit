import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const LanguageCulture = sequelize.define(
  "language_culture",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the language culture entry (auto-incremented)",
    },
    sections: {
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
    tableName: "language_culture",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information language culture",
  }
);

// console.log(await LanguageCulture.sync({ alter: true }))
export default LanguageCulture;
