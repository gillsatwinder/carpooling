const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpToken = sequelize.define('OtpToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  otp_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'otp_tokens',
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = OtpToken;