const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('M', 'F', 'Other'),
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  graduation_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Bio:{
      type: DataTypes.STRING(500),
      default: "",
      allowNull: true,
      validate:{
        len:[0,500],
      }
  },
  University: {
    type: DataTypes.STRING,
    allowNull:true
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull:true
  },
  ProfilePicture: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('DRIVER', 'PASSENGER', 'BOTH'),
    defaultValue:"PASSENGER",
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
  
}, {
  timestamps: false,
  tableName: 'users',
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = User;