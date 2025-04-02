import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import User from "./userSchema.js";

const Notification = sequelize.define(
  "notification",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the notification (auto-incremented)",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "User ID who will receive the notification",
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Notification subject",
    },
    message: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "Notification message",
    },
    status: {
      type: DataTypes.ENUM("unread", "read"),
      allowNull: false,
      defaultValue: "unread",
      comment: "Notification read status",
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
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  },
  { 
    tableName: "notification",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

// console.log(await Notification.sync({ alter: true }));

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

export default Notification;
