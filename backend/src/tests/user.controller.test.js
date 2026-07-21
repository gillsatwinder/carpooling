jest.mock("../services/user.services");
jest.mock("../utils/response");

const {
  completeOnboarding,
  getProfile,
  updateProfile,
} = require("../controllers/user.controller");

const userService = require("../services/user.services");
const { success, error } = require("../utils/response");

describe("User Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
        email: "john@university.edu",
      },
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("completeOnboarding", () => {
    it("should return 400 when required fields are missing", async () => {
      req.body = {
        sex: "Male",
      };

      await completeOnboarding(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Sex, age, and graduation_date are required"
      );

      expect(userService.updateProfileById).not.toHaveBeenCalled();
    });

    it("should complete onboarding successfully", async () => {
      req.body = {
        sex: "Male",
        age: 24,
        graduation_date: "2027-05-15",
      };

      const updatedUser = {
        id: 1,
        sex: "Male",
        age: 24,
        graduation_date: "2027-05-15",
        onboarded: true,
      };

      userService.updateProfileById.mockResolvedValue(updatedUser);

      await completeOnboarding(req, res);

      expect(userService.updateProfileById).toHaveBeenCalledWith(1, {
        sex: "Male",
        age: 24,
        graduation_date: "2027-05-15",
      });

      expect(success).toHaveBeenCalledWith(
        res,
        200,
        "Onboarding completed successfully",
        updatedUser
      );
    });

    it("should return 400 when service throws error", async () => {
      req.body = {
        sex: "Male",
        age: 24,
        graduation_date: "2027-05-15",
      };

      userService.updateProfileById.mockRejectedValue(
        new Error("User not found")
      );

      await completeOnboarding(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "User not found"
      );
    });
  });

  describe("getProfile", () => {
    it("should retrieve user profile successfully", async () => {
      const user = {
        id: 1,
        email: "john@university.edu",
        name: "John Doe",
      };

      userService.getProfile.mockResolvedValue(user);

      await getProfile(req, res);

      expect(userService.getProfile).toHaveBeenCalledWith(1);

      expect(success).toHaveBeenCalledWith(
        res,
        200,
        "User profile retrieved",
        user
      );
    });

    it("should return 400 when service throws error", async () => {
      userService.getProfile.mockRejectedValue(
        new Error("User not found")
      );

      await getProfile(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "User not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        major: "Computer Science",
      };

      const updatedUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        major: "Computer Science",
      };

      userService.updateProfile.mockResolvedValue(updatedUser);

      await updateProfile(req, res);

      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        first_name: "John",
        last_name: "Doe",
        major: "Computer Science",
      });

      expect(success).toHaveBeenCalledWith(
        res,
        200,
        "user profile updated",
        updatedUser
      );
    });

    it("should ignore email and password fields", async () => {
      req.body = {
        email: "new@email.com",
        password: "123456",
        first_name: "John",
      };

      userService.updateProfile.mockResolvedValue({
        id: 1,
        first_name: "John",
      });

      await updateProfile(req, res);

      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        first_name: "John",
      });
    });

    it("should return 400 when update service throws error", async () => {
      req.body = {
        first_name: "John",
      };

      userService.updateProfile.mockRejectedValue(
        new Error("Update failed")
      );

      await updateProfile(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Update failed"
      );
    });
  });
});