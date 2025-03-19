import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const OurInspiration = sequelize.define(
  "our_inspiration",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the our inspiration entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "our_inspiration",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information our inspiration",
  }
);

// console.log(await OurInspiration.sync({ alter: true }))
export default OurInspiration;
