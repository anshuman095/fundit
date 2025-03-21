import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const ExhibitionOn = sequelize.define(
  "exhibition_on",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the exhibition on entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "exhibition_on",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information exhibition on",
  }
);

// console.log(await ExhibitionOn.sync({ alter: true }))
export default ExhibitionOn;
