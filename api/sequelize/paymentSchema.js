import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import User from "./userSchema.js";

const Payment = sequelize.define(
    "payment",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the payment (auto-incremented)",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "INR",
        },
        status: {
            type: DataTypes.ENUM("pending", "paid", "failed"),
            allowNull: false,
            defaultValue: "pending",
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        payment_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        donation_cause: {
            type: DataTypes.STRING,
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
    { tableName: "payment", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await Payment.sync({ alter: true }));

User.hasMany(Payment, { foreignKey: "user_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });
export default Payment;
