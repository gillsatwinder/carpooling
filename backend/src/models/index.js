const sequelize = require("../config/database");

const User = require("./user.models");
const Post = require("./post.models");

// --------------------
// Associations
// --------------------

// User → Posts
User.hasMany(Post, { foreignKey: "user_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "user_id", as: "user" });

// If you add later:
// User.hasMany(Message)
// Post.hasMany(Conversation)

module.exports = {
  sequelize,
  User,
  Post,
};