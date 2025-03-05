import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const OurPartners = sequelize.define(
  "our_partners",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the partner (auto-incremented)",
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image associated with the partner",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Title of the partner",
    },
    sub_title: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Sub-title of the partner",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the partner",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "our_partners",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about our partners",
  }
);

export default OurPartners;
