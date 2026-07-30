const { User } = require("../models");

// Finds a user by email address, mainly used for authentication/login checks.
const findByEmail = async (email) => {
  return await User.findOne({
    where: { email },
  });
};

// Finds a user by primary key ID and returns only safe profile information.
const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: [
      "id",
      "name",
      "email",
      "age",
      "sex",
      "graduation_date",
      "Bio",
      "University",
      "PhoneNumber",
      "ProfilePicture",
      "role",
      "created_at",
    ],
  });
};

// Creates a new user record with registration and profile information.
const create = async ({
  name,
  email,
  password,
  age,
  sex,
  graduation_date,
  Bio,
  University,
  PhoneNumber,
  role,
  ProfilePicture,
}) => {
  return await User.create({
    name,
    email,
    password,
    age,
    sex,
    graduation_date,
    Bio,
    University,
    PhoneNumber,
    role,
    ProfilePicture,
  });
};

// Updates editable user profile fields using the user's ID.
const update = async (
  id,
  { name, age, sex, graduation_date, Bio, University, PhoneNumber,role}
) => {
  const [affectedRows, updatedRows] = await User.update(
    {
      name,
      age,
      sex,
      graduation_date,
      Bio,
      University,
      PhoneNumber,
      role,
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

// Update only the user's profile picture path
const updateProfilePicture = async (userId, filePath) => {
  const [updatedRows, updatedUsers] = await User.update(
    {  ProfilePicture: filePath},
    {
      where:{
        id:userId
      },
      returning:true
    }
  );
  if (updatedRows === 0) {
    return null;
  }
  return updatedUsers[0];
};
// Deletes a user permanently from the database using their ID.
const remove = async (id) => {
  return await User.destroy({
    where: { id },
  });
};

// Updates any provided user fields dynamically by user ID.
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
  updateProfilePicture,
};