import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const NavigationMenu = sequelize.define(
  "navigation_menu",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the navigation menu item (auto-incremented)",
    },
    menu_items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "navigation_menu",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store navigation menu items",
  }
);

// console.log(await NavigationMenu.sync({ alter: true }));
export default NavigationMenu;
