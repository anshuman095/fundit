import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const DonationCause = sequelize.define(
  "donation_cause",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the donation cause entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "donation_cause",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information donation cause",
  }
);

// console.log(await DonationCause.sync({ alter: true }))
export default DonationCause;
