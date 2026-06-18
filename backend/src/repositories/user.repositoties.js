const User = require("../models/user.models");

const findByEmail = async (email) => {
  return await User.findOne({
    where: { email },
  });
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "name", "email", "sex", "graduation_date", "created_at"],
  });
};

const create = async ({ name, email, password, sex, graduation_date }) => {
  return await User.create({
    name,
    email,
    password,
    sex,
    graduation_date,
  });
};

const update = async (id, { name, email, sex, graduation_date }) => {
  return await User.update(
    {
      name,
      email,
      sex,
      graduation_date,
    },
    {
      where: { id },
      returning: true,
    }
  );
};

const remove = async (id) => {
  return await User.destroy({
    where: { id },
  });
};

module.exports = {
  findByEmail,
  findById,
  create,
  update,
  remove,
};