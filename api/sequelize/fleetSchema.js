import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Fleet = sequelize.define(
  "fleet",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the fleet (auto-incremented)",
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Image associated with the fleet",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Title of the fleet",
    },

    // description: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Description of the fleet",
    // },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Status of the fleet (1 for active, 0 for inactive)",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "fleet",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store fleet information",
  }
);

export default Fleet;
