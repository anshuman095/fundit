import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Locations = sequelize.define(
  "locations",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the location (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // title: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    //   comment: "Title of the location",
    // },
    // location: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    //   comment: "Address or description of the location",
    // },
    // latitude: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    //   comment: "Latitude coordinate of the location",
    // },
    // longitude: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    //   comment: "Longitude coordinate of the location",
    // },
    // support_number: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true,
    //   comment: "Support contact number for the location",
    // },
    // deleted: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    //   comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    // },
  },
  {
    tableName: "locations",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store location information",
  }
);

export default Locations;
