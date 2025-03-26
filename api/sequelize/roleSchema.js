import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Role = sequelize.define(
  "role",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the role (auto-incremented)",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Name of the role",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the role",
    },
    permission: {
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
    tableName: "roles",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

// console.log(await Role.sync({ alter: true }));
export default Role;
