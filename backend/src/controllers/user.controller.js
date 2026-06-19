const userService = require("../services/user.services");
const { success, error } = require("../utils/response");

const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sex,age, graduation_date } = req.body;

      // Validate required fields
    if (!sex || !age || !graduation_date) {
      return res.status(400).json(
        error("Sex, age, and graduation_date are required")
      );
    }

    const updatedUser = await userService.updateProfile(userId, {
      sex,
      age,
      graduation_date,
    });

    return res.status(200).json(
      success("Onboarding completed successfully", updatedUser)
    );
  } catch (err) {
    return res.status(400).json(error(err.message));
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserProfile(userId);

    return res.status(200).json(
      success("User profile retrieved", user)
    );
  } catch (err) {
    return res.status(400).json(error(err.message));
  }
};

module.exports = {
  completeOnboarding,
  getProfile,
};