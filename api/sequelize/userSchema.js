import Role from "./roleSchema.js";
import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the user (auto-incremented)",
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Name of the user",
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "FUll Name of the user",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Email address of the user",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Status of the user (1 for active, 0 for inactive)",
    },
    mobile: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Mobile number of the user",
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Image of the user",
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Password of the user",
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      comment: "Role ID of the user",
    },
    address: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Address of the user",
    },
    otp: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "OTP of the user",
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "OTP expiry date of the user",
    },
    asset: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Asset of the user",
    },
    aadhar_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Aadhar number of the user",
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Pan number of the user",
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Donor or Volunteer or Staff",
    },
    socket_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Socket id of user for notification",
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
  { tableName: "users", timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" }
);

// console.log(await User.sync({ alter: true }));
export default User;
