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
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
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
