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

module.exports = {
  register,
  login
};