const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "RIDE_REQUEST",
        "RIDE_OFFER",
        "GENERAL_AD"
      ),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    pickup_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    pickup_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    pickup_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    destination_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    destination_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    ride_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    seats: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED", "CANCELLED"),
      defaultValue: "OPEN",
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Post;