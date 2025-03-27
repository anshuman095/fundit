import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const NewsMedia = sequelize.define(
  "news_media",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the news media entry (auto-incremented)",
    },
    news_media: {
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
    tableName: "news_media",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information news media",
  }
);

// console.log(await NewsMedia.sync({ alter: true }))
export default NewsMedia;
