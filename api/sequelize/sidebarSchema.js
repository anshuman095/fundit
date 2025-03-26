import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Sidebar = sequelize.define(
    "sidebar",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the sidebar (auto-incremented)",
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        route: {
            type: DataTypes.JSON,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING
        },
        active_image: {
            type: DataTypes.STRING
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        create: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        delete: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        edit: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        view: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
    { tableName: "sidebar", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await Sidebar.sync({ alter: true }));

export default Sidebar;
