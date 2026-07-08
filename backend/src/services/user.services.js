const userRepository = require("../repositories/user.repository");


const getProfile = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (email, data) => {
  const updatedUser = await userRepository.update(email, data);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const updateProfileById = async (userId, data) => {
  const updatedUser = await userRepository.updateById(userId, data);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};  



const deleteProfile = async (userId) => {
  const deletedUser = await userRepository.remove(userId);

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updateProfileById,
};