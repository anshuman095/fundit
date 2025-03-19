import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const MedicalCenter = sequelize.define(
    "medical_center",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the medical center entry (auto-incremented)",
        },
        mobile: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        sections: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        slider: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "medical_center",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        comment: "Table to store information medical center",
    }
);

// console.log(await MedicalCenter.sync({ alter: true }))
export default MedicalCenter;
