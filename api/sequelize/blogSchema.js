import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

// const Blog = sequelize.define(
//   "blog",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       comment: "Unique identifier for the slider settings (auto-incremented)",
//     },
//     transition_type: {
//       type: DataTypes.ENUM("Slide", "Fade", "Dissolve"),
//       allowNull: false,
//       defaultValue: "Slide",
//       comment: "Type of transition for the slider",
//     },
//     transition_duration: {
//       type: DataTypes.TEXT("long"),
//       allowNull: true,
//       comment: "Duration of the transition",
//     },
//     banner_height: {
//       type: DataTypes.TEXT("long"),

//       allowNull: true,
//       comment: "Height of the banner",
//     },
//     height_mode: {
//       type: DataTypes.ENUM("Fixed", "Variable"),
//       allowNull: true,
//       defaultValue: "Fixed",
//       comment: "Height of the banner",
//     },
//     autoplay: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       defaultValue: "Yes",
//       comment: "Whether the slider should autoplay",
//     },
//     pause_on_hover: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       defaultValue: "Yes",
//       comment: "Whether the slider should pause on hover",
//     },
//     navigation_arrows: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       defaultValue: "Yes",
//       comment: "Whether navigation arrows are enabled",
//     },
//     pagination_dots: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       defaultValue: "Yes",
//       comment: "Whether pagination dots are enabled",
//     },
//     // Array of blog entries stored as JSON
//     slides: {
//       type: DataTypes.JSON,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "blog",
//     timestamps: false,
//     charset: "utf8mb4",
//     collate: "utf8mb4_general_ci",
//     comment: "Table to store information of blog",
//   }
// );

const Blog = sequelize.define(
  "blog",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the slider settings (auto-incremented)",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Title of the blog",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the blog",
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image of the blog",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Status of the blog (1 for active, 0 for inactive)",
    },
  },
  {
    tableName: "blog",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information of blog",
  }
);
export default Blog;
