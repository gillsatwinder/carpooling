const userService = require("../services/user.services");
const { success, error } = require("../utils/response");

const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
  
    const { sex,age, graduation_date } = req.body;

      // Validate required fields
    if (!sex || !age || !graduation_date) {
      return error(
    res,
    400,
    "Sex, age, and graduation_date are required"
  );
}

    const updatedUser = await userService.updateProfile(userId, {
      sex,
      age,
      graduation_date,
    });

    return success(
      res,
      200,
      "Onboarding completed successfully",
      updatedUser
    );
  } catch (err) {
     return error(res, 400, err.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const useremail = req.user.email;
    const user = await userService.getProfile(useremail)
    return success(
      res,
      200,
      "User profile retrieved",
       user
    );
  } catch (err) {
    return error(res, 400, err.message);
  }
};

const updateProfile = async(req, res )=> {
  try {
    const useremail= req.user.email;

    const {email,password, ...updates}= req.body;
    const user = await userService.updateProfile(useremail, updates);
    return success(
      res,
      200,
      "user profile updated", 
      user
    );
  }
  catch(err) {
    return error(res, 400, err.message);
  }
};

module.exports = {
  completeOnboarding,
  getProfile,
  updateProfile,
};