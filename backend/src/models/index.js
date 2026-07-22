const sequelize = require("../config/database");

const User = require("./user.models");
const Post = require("./post.models");
const RideParticipant=require("./ride_participant.models")

// --------------------
// Associations
// --------------------

// User → Posts
User.hasMany(Post, { foreignKey: "owner_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
Post.hasMany(RideParticipant, {
    foreignKey: "post_id",
    as: "participants",
});

RideParticipant.belongsTo(Post, {
    foreignKey: "post_id",
});

RideParticipant.belongsTo(User, {
    foreignKey: "user_id",
    as: "participant",
});

User.hasMany(RideParticipant, {
    foreignKey: "user_id",
    as: "rideParticipations",
});

// If you add later:
// User.hasMany(Message)
// Post.hasMany(Conversation)

module.exports = {
  sequelize,
  User,
  Post,
  RideParticipant,
};