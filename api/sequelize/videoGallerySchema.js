import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const VideoGallery = sequelize.define(
  "video_gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the video gallery entry (auto-incremented)",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_urls: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "video_gallery",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information video gallery",
  }
);

// console.log(await VideoGallery.sync({ alter: true }))
export default VideoGallery;
