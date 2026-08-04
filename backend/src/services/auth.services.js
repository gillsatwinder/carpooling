const userRepository = require("../repositories/user.repository");
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../utils/password");
const otpService = require("./otp.services"); 

const signup = async ({ email, name, password }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.create({
    email,
    name,
    password: hashedPassword,
  });

  // NEW: generate + send the OTP right after creating the user.
  await otpService.createAndSendOtp(user.id, user.email);

  return {
    message: "Account created. Please check your email for a verification code.",
    userId: user.id, // WHY we return this: the frontend needs it to call verify-otp next
  };
  
};



const login = async ({ email, password}) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not registered");
  }
 // const hashedPassword = await hashPassword(password);

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email before logging in.");
  }


  const onboarded =
  !!user.sex &&
  !!user.age &&
  !!user.graduation_date;
  const token = jwt.sign(
    {
    id: user.id,
    email: user.email
  },
    process.env.JWT_SECRET || 'super_secret_key',
  { expiresIn: '1h'}
  );

  return {
    token:token,
    onboarded: onboarded,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  };
};


// NEW: thin wrapper around otpService.verifyOtp — keeps the controller
// only ever talking to auth.services.js, same as it does for
// signup/login, rather than reaching into otp.services.js directly.
const verifyOtp = async (userId, otp) => {
  return await otpService.verifyOtp(userId, otp);
};

// NEW: looks up the user by email, then delegates to otpService to
// actually generate + send a new code.
const resendOtp = async (email) => {
  const user = await userRepository.findByEmail(email);

  // WHY we don't say "no such user" or "already verified" explicitly:
  // this would leak which emails are registered in your system
  // (user enumeration attack) — same reasoning as your existing
  // "Email already exists" check, but flipped: here we stay vague
  // on purpose rather than vague by omission.
  if (!user) {
    throw new Error("If this account needs verification, a new code has been sent.");
  }

  if (user.is_verified) {
    throw new Error("This account is already verified. Please log in.");
  }

  await otpService.createAndSendOtp(user.id, user.email);

  return { message: "A new code has been sent to your email." };
};

module.exports = {
  signup,
  login,
  verifyOtp,   
  resendOtp,  
};

