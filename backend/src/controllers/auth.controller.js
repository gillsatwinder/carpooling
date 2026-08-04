const authService = require("../services/auth.services");
const { success, error } = require("../utils/response");
const {signupValidator, signinvalidator} = require("../validators/auth.validators");
const register = async (req, res) => {
    const result = signupValidator(req.body)

    if (result.error){
        return error(res,400, result.error)
    }
  try {
      
    const result = await authService.signup(req.body);

    return success(res, 201, "User registered successfully", result);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

const login = async( req, res) => {
  const result = signinvalidator(req.body)

  if (result.error){
          return error(res,400, result.error)
      }
  try { 
      const result = await authService.login(req.body);

      return success(res, 201, "User Login successfully", result);
    } catch (err) {
      return error(res, 400, err.message);
    }
  
}
// NEW: handles POST /verify-otp
// WHY no validator file used here: kept as a simple inline check for
// now, matching the same error-handling shape as register/login.
// You can move this into auth.validators.js later if you want full
// consistency, but it's not required for this to work.
const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return error(res, 400, "userId and otp are required");
  }

  try {
    const result = await authService.verifyOtp(userId, otp);
    return success(res, 200, "Email verified successfully", result);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

// NEW: handles POST /resend-otp
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return error(res, 400, "email is required");
  }

  try {
    const result = await authService.resendOtp(email);
    return success(res, 200, "A new code has been sent to your email", result);
  } catch (err) {
    return error(res, 400, err.message);
  }
}


module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
};