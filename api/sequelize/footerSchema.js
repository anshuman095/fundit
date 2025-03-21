import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Footer = sequelize.define(
    "footer",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the footer (auto-incremented)",
        },
        title: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        news_title: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        location: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        bg_image: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        emails: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        contacts: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        visiting_hours: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
    },
    { tableName: "footer", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await Footer.sync({ alter: true }));

export default Footer;
