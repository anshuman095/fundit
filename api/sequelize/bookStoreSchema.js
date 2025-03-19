import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const BookStore = sequelize.define(
  "book_store",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the book store entry (auto-incremented)",
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "book_store",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information book store",
  }
);

// console.log(await BookStore.sync({ alter: true }))
export default BookStore;
