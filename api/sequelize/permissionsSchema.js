import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";
import Role from "./roleSchema.js";

const Permission = sequelize.define(
  "permission",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the permission (auto-incremented)",
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      comment: "Role ID of the user",
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "module",
        key: "id",
      },
      comment: "Module ID of the module",
    },
    create: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "create  permission",
    },
    read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "read permission",
    },
    update: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "update permission",
    },
    delete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "delete permission",
    },
  },
  {
    tableName: "permission",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store permission information",
  }
);

export default Permission;
