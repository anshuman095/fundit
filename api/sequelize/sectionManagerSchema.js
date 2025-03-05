import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const SectionManager = sequelize.define(
  "section_manager",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the section manager (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "section_manager",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information section manager",
  }
);

export default SectionManager;
