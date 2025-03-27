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
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
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

// console.log(await SectionManager.sync({ alter: true }));
export default SectionManager;
