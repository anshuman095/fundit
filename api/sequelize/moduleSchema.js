import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";
import Role from "./roleSchema.js";

const Module = sequelize.define(
  "module",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the module (auto-incremented)",
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "module",
        key: "id",
      },
      comment: "parent ID of the module",
    },
    name: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "name of the module",
    },
    path: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "path of the  module",
    },
    icon: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "icon of the  module",
    },
    active_image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "active image of the module",
    },
    route: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "route of the  module",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "module",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store module information",
  }
);

// console.log(await Module.sync({ alter: true }))
export default Module;
