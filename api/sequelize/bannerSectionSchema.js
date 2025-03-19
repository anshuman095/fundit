import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const BannerSection = sequelize.define(
  "banner_section",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the banner section entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "banner_section",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information banner section",
  }
);

// console.log(await BannerSection.sync({ alter: true }))
export default BannerSection;
