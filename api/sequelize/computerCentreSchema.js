import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const ComputerCentre = sequelize.define(
  "computer_centre",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the computer centre entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "computer_centre",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information computer centre",
  }
);

// console.log(await ComputerCentre.sync({ alter: true }))
export default ComputerCentre;
