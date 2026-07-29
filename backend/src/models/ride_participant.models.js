const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RideParticipant = sequelize.define(
  "RideParticipant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("PASSENGER", "DRIVER"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "CANCELLED"
      ),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "ride_participants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = RideParticipant;