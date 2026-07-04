const { Post, User } = require("../models");

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
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

// Get by user
exports.findByUserId = async (userId) => {
  return await Post.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });
};

// Get single
exports.findById = async (id) => {
  return await Post.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

// Update
exports.update = async (id, data) => {
  await Post.update(data, { where: { id } });
  return await exports.findById(id);
};