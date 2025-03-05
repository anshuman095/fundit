import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const ContactForm = sequelize.define(
  "contact_form",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the contact form (auto-incremented)",
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Name of the user",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Email address of the user",
    },
    mobile: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Mobile number of the user",
    },
    message: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Message of the user",
    },
    reply: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Response of the user",
    },

    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "contact_form",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information of contact_form",
  }
);
export default ContactForm;
