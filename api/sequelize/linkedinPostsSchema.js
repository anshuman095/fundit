import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const LinkedinPosts = sequelize.define(
  "linkedin_posts",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the linkedin (auto-incremented)",
    },
    post_id: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Post ID of the linkedin",
    },
    linkedin_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Linkedin ID of the linkedin",
    },
    media: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "media associated with the linkedin",
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Content of the linkedin",
    },
    media_title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Media Title of the linkedin",
    },
    media_description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Media Description of the linkedin",
    },
    media_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Media Type of the linkedin",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "linkedin_posts",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about our partners",
  }
);

export default LinkedinPosts;
