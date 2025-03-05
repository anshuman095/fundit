import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const OurTeam = sequelize.define(
  "our_team",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      comment: "Unique identifier for the entry (auto-incremented)",
    },
    member_name: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Title of the entry",
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Image associated with the entry",
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "our_team",
        key: "id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Status of the product (1 for active, 0 for inactive)",
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Indicator for soft deletion (0 for active, 1 for deleted)",
    },
  },
  {
    tableName: "our_team",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    comment: "Table to store information about our team",
  }
);

OurTeam.hasMany(OurTeam, {
  foreignKey: "parent_id",
  as: "members",
});

OurTeam.belongsTo(OurTeam, {
  foreignKey: "parent_id",
  as: "parent",
});
export default OurTeam;
