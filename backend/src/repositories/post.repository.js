const { Post, User } = require("../models");
const { Op, literal } = require("sequelize");

// Create post
exports.create = async (data) => {
  return await Post.create(data);
};

// Get all posts
exports.findAll = async (filters) => {
  const where = {};

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

  return await Post.findAll({
    where,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "ProfilePicture"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

// Get by user
exports.findByUserId = async (userId) => {
  return await Post.findAll({
    where: { owner_id: userId },
    order: [["created_at", "DESC"]],
  });
};

// Get single
exports.findById = async (id) => {
  return await Post.findByPk(id, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "ProfilePicture"],
      },
    ],
  });
};

// Update
exports.update = async (id, data) => {
  await Post.update(data, { where: { id } });
  return await exports.findById(id);
};

exports.delete = async (id) => {
  return await Post.destroy({ where: { id } });
};

exports.searchNearbyPosts = async ({ lat, lng, date }) => {
  const distanceFormula = literal(`
    (
      6371 *
      acos(
        cos(radians(${lat}))
        *
        cos(radians("pickup_lat"))
        *
        cos(radians("pickup_lng") - radians(${lng}))
        +
        sin(radians(${lat}))
        *
        sin(radians("pickup_lat"))
      )
    )
  `);

  const where = {
    status: "OPEN",
  };

  if (date) {
    where.ride_date = date;
  }

  return await Post.findAll({
    attributes: {
      include: [[distanceFormula, "distance"]],
    },

    where,

    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "ProfilePicture"],
      },
    ],

    order: [[literal("distance"), "ASC"]],
  });
};