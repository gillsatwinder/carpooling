jest.mock("../services/auth.services");
jest.mock("../utils/response");
jest.mock("../validators/auth.validators");
const { register, login, verifyOtp, resendOtp } = require("../controllers/auth.controller");
const authService = require("../services/auth.services");
const { success, error } = require("../utils/response");
const {
  signupValidator,
  signinvalidator,
} = require("../validators/auth.validators");


describe("Auth Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {};

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 when validation fails", async () => {
      signupValidator.mockReturnValue({
        error: "Invalid input",
      });

      await register(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Invalid input"
      );

      expect(authService.signup).not.toHaveBeenCalled();
    });

    it("should register user successfully", async () => {
      req.body = {
        name: "John Doe",
        email: "john@university.edu",
        password: "password123",
      };

      signupValidator.mockReturnValue({
        error: null,
      });

      const serviceResponse = {
        id: 1,
        token: "jwt-token",
      };

      authService.signup.mockResolvedValue(
        serviceResponse
      );

      await register(req, res);

      expect(authService.signup).toHaveBeenCalledWith(
        req.body
      );

      expect(success).toHaveBeenCalledWith(
        res,
        201,
        "User registered successfully",
        serviceResponse
      );
    });

    it("should return 400 when service throws error", async () => {
      signupValidator.mockReturnValue({
        error: null,
      });

      authService.signup.mockRejectedValue(
        new Error("Email already exists")
      );

      await register(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Email already exists"
      );
    });
  });

  describe("login", () => {
    it("should return 400 when validation fails", async () => {
      signinvalidator.mockReturnValue({
        error: "Invalid credentials",
      });

      await login(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Invalid credentials"
      );

      expect(authService.login).not.toHaveBeenCalled();
    });

    it("should login successfully", async () => {
      req.body = {
        email: "john@university.edu",
        password: "password123",
      };

      signinvalidator.mockReturnValue({
        error: null,
      });

      const serviceResponse = {
        token: "jwt-token",
      };

      authService.login.mockResolvedValue(
        serviceResponse
      );

      await login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        req.body
      );

      expect(success).toHaveBeenCalledWith(
        res,
        201,
        "User Login successfully",
        serviceResponse
      );
    });

    it("should return 400 when login service throws error", async () => {
      signinvalidator.mockReturnValue({
        error: null,
      });

      authService.login.mockRejectedValue(
        new Error("Invalid email or password")
      );

      await login(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Invalid email or password"
      );
    });
  });

  describe("verifyOtp", () => {
    it("should return 400 when userId is missing", async () => {
      req.body = { otp: "123456" };

      await verifyOtp(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "userId and otp are required"
      );

      expect(authService.verifyOtp).not.toHaveBeenCalled();
    });

    it("should return 400 when otp is missing", async () => {
      req.body = { userId: 1 };

      await verifyOtp(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "userId and otp are required"
      );

      expect(authService.verifyOtp).not.toHaveBeenCalled();
    });

    it("should verify otp successfully", async () => {
      req.body = {
        userId: 1,
        otp: "123456",
      };

      const serviceResponse = {
        message: "Email verified successfully.",
        token: "jwt-token",
        user: { id: 1, name: "John Doe", email: "john@university.edu" },
      };

      authService.verifyOtp.mockResolvedValue(serviceResponse);

      await verifyOtp(req, res);

      expect(authService.verifyOtp).toHaveBeenCalledWith(1, "123456");

      expect(success).toHaveBeenCalledWith(
        res,
        200,
        "Email verified successfully",
        serviceResponse
      );
    });

    it("should return 400 when service throws error", async () => {
      req.body = {
        userId: 1,
        otp: "000000",
      };

      authService.verifyOtp.mockRejectedValue(
        new Error("Incorrect code. Please try again.")
      );

      await verifyOtp(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "Incorrect code. Please try again."
      );
    });
  });

  describe("resendOtp", () => {
    it("should return 400 when email is missing", async () => {
      req.body = {};

      await resendOtp(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "email is required"
      );

      expect(authService.resendOtp).not.toHaveBeenCalled();
    });

    it("should resend otp successfully", async () => {
      req.body = { email: "john@university.edu" };

      const serviceResponse = {
        message: "A new code has been sent to your email.",
      };

      authService.resendOtp.mockResolvedValue(serviceResponse);

      await resendOtp(req, res);

      expect(authService.resendOtp).toHaveBeenCalledWith(
        "john@university.edu"
      );

      expect(success).toHaveBeenCalledWith(
        res,
        200,
        "A new code has been sent to your email",
        serviceResponse
      );
    });

    it("should return 400 when service throws error", async () => {
      req.body = { email: "notfound@university.edu" };

      authService.resendOtp.mockRejectedValue(
        new Error("If this account needs verification, a new code has been sent.")
      );

      await resendOtp(req, res);

      expect(error).toHaveBeenCalledWith(
        res,
        400,
        "If this account needs verification, a new code has been sent."
      );
    });
  });
});