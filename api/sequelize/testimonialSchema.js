import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Testimonial = sequelize.define(
  "testimonial",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the slider settings (auto-incremented)",
    },
    transition_type: {
      type: DataTypes.ENUM("Slide", "Fade", "Dissolve"),
      allowNull: false,
      defaultValue: "Slide",
      comment: "Type of transition for the slider",
    },
    transition_duration: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Duration of the transition",
    },
    banner_height: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "Height of the banner",
    },
    height_mode: {
      type: DataTypes.ENUM("Fixed", "Variable"),
      allowNull: true,
      defaultValue: "Fixed",
      comment: "Height of the banner",
    },
    autoplay: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "Yes",
      comment: "Whether the slider should autoplay",
    },
    pause_on_hover: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "Yes",
      comment: "Whether the slider should pause on hover",
    },
    navigation_arrows: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "Yes",
      comment: "Whether navigation arrows are enabled",
    },
    pagination_dots: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "Yes",
      comment: "Whether pagination dots are enabled",
    },
    // Array of testimonial entries stored as JSON
    slides: {
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
    tableName: "testimonial",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information of testimonial",
  }
);

// console.log(await Testimonial.sync({ alter: true }));
export default Testimonial;
