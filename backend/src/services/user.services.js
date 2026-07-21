const userRepository = require("../repositories/user.repository");


const getProfile = async (userid) => {
  const user = await userRepository.findById(userid);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (id, data) => {
  const updatedUser = await userRepository.update(id, data);

  if (!updatedUser) {
    throw new Error("User not found");s
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