const userRepository = require("../repositories/user.repository");
const fs = require("fs");
const path = require("path");


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

const updateProfilePicture = async (userId, filePath) => {
  // Get current user to find the old profile picture
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  // Delete old profile picture if it exists
  if (user.ProfilePicture) {
    const oldImagePath = path.join(
      __dirname,
      "../../",
      user.ProfilePicture
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Save new profile picture path in database
  const updatedPhoto = await userRepository.updateProfilePicture(userId, filePath);
  if (!updatedPhoto) {
    throw new Error("Photo not updated");
  }
  return updatedPhoto;
};


module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updateProfileById,
  updateProfilePicture,
};