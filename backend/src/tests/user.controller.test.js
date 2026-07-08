
jest.mock("../services/user.services");
jest.mock("../utils/response");

const {
  completeOnboarding,
  getProfile,
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

      expect(userService.updateProfile).not.toHaveBeenCalled();
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

      userService.updateProfile.mockResolvedValue(
        updatedUser
      );

      await completeOnboarding(req, res);

      expect(userService.updateProfile).toHaveBeenCalledWith(
        1,
        {
          sex: "Male",
          age: 24,
          graduation_date: "2027-05-15",
        }
      );

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

      userService.updateProfile.mockRejectedValue(
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

    //  success.mockReturnValue({
     //   message: "User profile retrieved",
     //   data: user,
     // });

      await getProfile(req, res);

      expect(userService.getProfile).toHaveBeenCalledWith(
        "john@university.edu"
      );

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
});

