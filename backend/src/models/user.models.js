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
  
}, {
  timestamps: false,
  tableName: 'users',
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = User;