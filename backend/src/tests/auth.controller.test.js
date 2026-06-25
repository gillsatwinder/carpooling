

jest.mock("../services/auth.services");
jest.mock("../utils/response");
jest.mock("../validators/auth.validators");
const { register, login } = require("../controllers/auth.controller");
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
});

