import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const DynamicModulesHome = sequelize.define(
  "dynamic_modules_home",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the dynamic modules home entry (auto-incremented)",
    },
    tables: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "dynamic_modules_home",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information dynamic modules home",
  }
);

// console.log(await DynamicModulesHome.sync({ alter: true }))
export default DynamicModulesHome;
