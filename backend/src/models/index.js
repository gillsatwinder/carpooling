const sequelize = require("../config/database");

const User = require("./user.models");
const Post = require("./post.models");

// --------------------
// Associations
// --------------------

// User → Posts
User.hasMany(Post, { foreignKey: "owner_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// If you add later:
// User.hasMany(Message)
// Post.hasMany(Conversation)

module.exports = {
  sequelize,
  User,
  Post,
};