import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import User from "./userSchema.js";

const Donation = sequelize.define(
    "donation",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "Unique identifier for the donation (auto-incremented)",
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: "Name of the User",
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: "Email address of the User",
        },
        mobile: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: "Mobile number of the User",
        },
        aadhar_number: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Aadhar number of the User",
        },
        pan_number: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Pan number of the User",
        },
        aadhar_url: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "Image of the aadhar",
        },
        pan_url: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "Image of the pan",
        },
        donation_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            comment: "Address of the User",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        donation_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "Online or Offline donation",
        },
        anonymous: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
        },
    },
    { tableName: "donation", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await Donation.sync({ alter: true }));

User.hasMany(Donation, { foreignKey: "user_id" });
Donation.belongsTo(User, { foreignKey: "user_id" });
export default Donation;
