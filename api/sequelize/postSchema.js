import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Post = sequelize.define(
  "post",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the post (auto-incremented)",
    },
    type: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Type of the post",
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Content of the post",
    },
    media_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Media Type of the post",
    },
    media: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Media Url of the post",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "post",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about all social post",
  }
);

export default Post;
