import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const SocialMediaSecrets = sequelize.define(
  "social_media_secrets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("meta", "twitter", "linkedin", "google", "email", "razorpay"),
      allowNull: false,
    },
    client_id: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    client_secret: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    social_media_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_business_account_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access_token: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    page_access_token: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    access_secret: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valid_oauth_uri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_port: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_key_id : {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    razorpay_key_secret : {
      type: DataTypes.TEXT("long"),
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
    tableName: "social_media_secrets",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about social media",
  }
);

// console.log(await SocialMediaSecrets.sync({ alter: true }));
export default SocialMediaSecrets;
