import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Volunteer = sequelize.define(
  "volunteer",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the volunteer entry (auto-incremented)",
    },
    volunteer: {
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
    tableName: "volunteer",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information volunteer",
  }
);

// console.log(await Volunteer.sync({ alter: true }))
export default Volunteer;
