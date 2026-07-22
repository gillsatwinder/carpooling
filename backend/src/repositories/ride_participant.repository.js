const { RideParticipant,User } = require("../models");

exports.create = async (data) => {
  return await RideParticipant.create(data);
};

exports.findByPostAndUser = async (postId, userId) => {
  return await RideParticipant.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });
};

exports.findAllByPost = async (postId) => {
  return await RideParticipant.findAll({
    where: {
      post_id: postId,
    },
    include: [
      {
        model: User,
        as: "participant",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};