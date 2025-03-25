import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Medical = sequelize.define(
    "medical",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the medical entry (auto-incremented)",
        },
        sections: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        medical_sections: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "medical",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        comment: "Table to store information medical",
    }
);

// console.log(await Medical.sync({ alter: true }))
export default Medical;
