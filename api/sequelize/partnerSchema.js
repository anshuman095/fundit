import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Partner = sequelize.define(
  "partner",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the partner (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // image: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Image associated with the partner",
    // },
    // partner_name: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "Title of the partner",
    // },
    // website_url: {
    //   type: DataTypes.TEXT("long"),
    //   allowNull: true,
    //   comment: "URL of the partner's website",
    // },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
    // unique_id: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    //   comment: "Unique identifier for the about us entry",
    // },
  },
  {
    tableName: "partner",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about partners",
  }
);

// console.log(await Partner.sync({ alter: true }));
export default Partner;
