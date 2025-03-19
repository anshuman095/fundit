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
