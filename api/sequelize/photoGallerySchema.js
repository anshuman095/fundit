import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const PhotoGallery = sequelize.define(
  "photo_gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the photo gallery entry (auto-incremented)",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_gallery: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "photo_gallery",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information photo gallery",
  }
);

// console.log(await PhotoGallery.sync({ alter: true }))
export default PhotoGallery;
