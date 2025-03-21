import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const ScheduleQuote = sequelize.define(
    "schedule_quote",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the schedule quote (auto-incremented)",
        },
        asset: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        said_by: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        reference: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        schedule_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        schedule_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
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
    { tableName: "schedule_quote", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await ScheduleQuote.sync({ alter: true }));

export default ScheduleQuote;
