const userService = require("../services/user.services");
const { success, error } = require("../utils/response");

const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
  
    const {
      sex,
      age,
      graduation_date,
      Bio,
      University,
      PhoneNumber,
      ProfilePicture,
    } = req.body;


    const updatedUser = await userService.updateProfileById(userId, {
        sex,
        age,
        graduation_date,
        Bio,
        University,
        PhoneNumber,
        ProfilePicture,
    });

    return success(
      res,
      200,
      "Onboarding completed successfully",
      updatedUser
    );
  } catch (err) {
     return error(res, 500, err.message);
  }
};

// Retrieves the logged-in user's profile information.
const getProfile = async (req, res) => {
  try {
    const userid= req.user.id;
    const user = await userService.getProfile(userid)
    return success(
      res,
      200,
      "User profile retrieved",
       user
    );
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// Updates editable user profile fields.
const updateProfile = async(req, res )=> {
  try {
    const userid= req.user.id;
    const {email,password, ...updates}= req.body;
    const user = await userService.updateProfile(userid, updates);
    return success(
      res,
      200,
      "user profile updated", 
      user
    );
  }
  catch(err) {
    return error(res, 500, err.message);
  }
};

//update the profielpicture
const updateProfilePicture = async (req, res) => {
  try {
    
    const userId = req.user.id;
    // Check if user uploaded a file
    if (!req.file) {
      return error(
        res,
        400,
        "Profile picture is required"
      );
    }
    const profilePicture =
      `/uploads/profile/${req.file.filename}`;
    const updatedUser =
      await userService.updateProfilePicture(
        userId,
        profilePicture
      );
    return success(
      res,
      200,
      "Profile picture updated successfully",
      updatedUser
    );

  } catch(err) {
    return error(
      res,
      400,
      err.message
    );

  }
};

module.exports = {
  completeOnboarding,
  getProfile,
  updateProfile,
  updateProfilePicture,
};