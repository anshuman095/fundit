import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Banner = sequelize.define(
  "banner",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the product banner (auto-incremented)",
    },
    // sections: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
    banner: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image associated with the product banner",
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Title of the product banner",
    },
    sub_title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Sub title of the product banner",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Description of the product banner",
    },
    type: {
      type: DataTypes.ENUM("product", "service", "whoWeAre", "fleet"),
      allowNull: false,
      comment: "Type of the banner (service or product)",
    },
    // status: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 1,
    //   comment: "Status of the product banner (1 for active, 0 for inactive)",
    // },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "banner",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store product banner information",
  }
);

export default Banner;
