import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const PreFooter = sequelize.define(
    "pre_footer",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the pre footer (auto-incremented)",
        },
        title: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        sub_title: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        btn_title: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        bg_image: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        asset: {
            type: DataTypes.TEXT("long"),
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
    { tableName: "pre_footer", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await PreFooter.sync({ alter: true }));

export default PreFooter;
