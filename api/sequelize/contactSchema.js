import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Contact = sequelize.define(
  "contact",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the contact (auto-incremented)",
    },
    // sections: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Title of the contact",
    },
    sub_title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Sub title of the contact",
    },
    company_registration: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Company Registration of the contact",
    },
    location: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Location of the contact",
    },
    mobile: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "mobile of the contact",
    },
    linkedin_url: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Linkedin Url of the contact",
    },
    facebook_url: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Facebook Url of the contact",
    },
    twitter_url: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Twitter Url of the contact",
    },
    instagram_url: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Instagram Url of the contact",
    },
    asset: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Asset of the contact",
    },
    emails: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Emails of the contact",
    },
  },
  {
    tableName: "contact",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about us",
  }
);

export default Contact;
