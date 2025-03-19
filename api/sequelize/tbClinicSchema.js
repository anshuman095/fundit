import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const TbClinic = sequelize.define(
  "tb_clinic",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the tb clinic entry (auto-incremented)",
    },
    mobile: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "tb_clinic",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information tb clinic",
  }
);

// console.log(await TbClinic.sync({ alter: true }))
export default TbClinic;
