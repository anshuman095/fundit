import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const HeroBannerSliderSettings = sequelize.define(
  "hero_banner_slider_settings",
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
      type: DataTypes.TEXT("long"),
      allowNull: true,
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
  },
  {
    tableName: "hero_banner_slider_settings",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store hero banner slider settings",
  }
);

export default HeroBannerSliderSettings;
