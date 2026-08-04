const sequelize = require("../config/database");

const User = require("./user.models");
const Post = require("./post.models");
const RideParticipant=require("./ride_participant.models")
const Notification= require("./notification.models")

const OtpToken = require("./otptoken.models");


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
    as: "post",
});

RideParticipant.belongsTo(User, {
    foreignKey: "user_id",
    as: "participant",
});

User.hasMany(RideParticipant, {
    foreignKey: "user_id",
    as: "rideParticipations",
});

// User → Notifications
User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});


// NEW: User → OtpTokens
// WHY hasMany: one user can have MULTIPLE otp_tokens over time
// (every signup attempt / resend creates a new row — see earlier
// explanation on why we chose a separate table instead of fields directly on User).
User.hasMany(OtpToken, {
    foreignKey: "user_id",
    as: "otpTokens",
});

// NEW: OtpToken → User (the reverse direction)
// WHY belongsTo: each individual otp_token row belongs to exactly
// ONE user. This is what lets you write things like
// OtpToken.findOne({ where: {...}, include: 'user' }) later if needed,
// and it's what makes the foreign key relationship official in Sequelize
// (not just at the raw DB level from the migration).
OtpToken.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});


// If you add later:
// User.hasMany(Message)
// Post.hasMany(Conversation)

module.exports = {
  sequelize,
  User,
  Post,
  RideParticipant,
  Notification,
  OtpToken,
};