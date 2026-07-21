const { User } = require("../models");

const findByEmail = async (email) => {
  return await User.findOne({
    where: { email },
  });
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "name", "email", "age","sex", "graduation_date", "created_at"],
  });
};

const create = async ({ name, email, password, age, sex, graduation_date }) => {
  return await User.create({
    name,
    email,
    password,
    age,
    sex,
    graduation_date,
  });
};

const update = async (id, { name, age, sex, graduation_date }) => {
  const [affectedRows, updatedRows] = await User.update(
    {
      name,
      age,
      sex,
      graduation_date,
    },
    {
      where: { id },
      returning: true,
    }
  );
  if (affectedRows === 0) {
    return null;
  }

  return updatedRows[0];

};

const remove = async (id) => {
  return await User.destroy({
    where: { id },
  });
};

const updateById = async (id, data) => {
  return await User.update(data, {
    where: { id },
    returning: true,
  });
};

module.exports = {
  findByEmail,
  findById,
  create,
  update,
  remove,
  updateById,
};