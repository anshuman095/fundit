import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const AboutUs = sequelize.define(
  "about_us",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the about us entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // image: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Image associated with the about us entry",
    // },
    // title: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Title of the about us entry",
    // },

    // description: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Description of the about us entry",
    // },

    // deleted: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    //   comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    // },
  },
  {
    tableName: "about_us",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about us",
  }
);

export default AboutUs;
