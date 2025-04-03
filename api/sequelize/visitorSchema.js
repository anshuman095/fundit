import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Visitor = sequelize.define(
    "visitor",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the visitor (auto-incremented)",
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
    { tableName: "visitor", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await Visitor.sync({ alter: true }));

export default Visitor;
