import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const DonationPage = sequelize.define(
  "donation_page",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the donation page entry (auto-incremented)",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    contribution_files: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    endowment_asset: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "donation_page",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information donation page",
  }
);

// console.log(await DonationPage.sync({ alter: true }))
export default DonationPage;
