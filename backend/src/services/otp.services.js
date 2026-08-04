const otpTokenRepository = require("../repositories/otpToken.repository");
const userRepository = require("../repositories/user.repository"); // NEW: needed to fetch user + mark verified
const jwt = require("jsonwebtoken"); // NEW: same library your auth.services.js already uses
const { generateOtp, hashOtp, verifyOtpHash } = require("../utils/otp");
const { sendOtpEmail } = require("./email.services");

const OTP_EXPIRY_MINUTES = 10; // WHY 10 min: long enough to check inbox, short enough to limit risk
const MAX_ATTEMPTS = 5; // WHY 5: enough for a genuine typo, low enough to block brute-forcing a 6-digit code

// WHY this is one function used by BOTH signup and resend-otp:
// avoids duplicating the "generate + store + send" logic in two places.
const createAndSendOtp = async (userId, email) => {
  const otp = generateOtp();
  const otp_hash = hashOtp(otp);
  const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpTokenRepository.invalidateActiveOtps(userId);
  await otpTokenRepository.create({ user_id: userId, otp_hash, expires_at });

  // WHY we pass the RAW otp here (not the hash): this is the only
  // place the real code exists outside the database — it goes straight
  // to the user's inbox and is never persisted anywhere as plain text.
  await sendOtpEmail(email, otp);
};

// WHY this throws Error like your other services (auth.services.js  pattern), instead of returning a { success, reason } object:
// keeps this file consistent with how your controllers already expect to catch and handle errors from the service layer.
const verifyOtp = async (userId, inputOtp) => {
  const record = await otpTokenRepository.findLatestActive(userId);

  if (!record) {
    throw new Error("No active verification code found. Please request a new one.");
  }

  if (new Date(record.expires_at) < new Date()) {
    throw new Error("This code has expired. Please request a new one.");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new Error("Too many incorrect attempts. Please request a new code.");
  }

  const isValid = verifyOtpHash(inputOtp, record.otp_hash);

  if (!isValid) {
    // WHY we increment on every failure: keeps the counter accurate
    // even if the request is interrupted right after this.
    await otpTokenRepository.incrementAttempts(record.id);
    throw new Error("Incorrect code. Please try again.");
  }

  // WHY mark used on success: prevents this exact code from being reused/replayed again.
  await otpTokenRepository.markUsed(record.id);

  const user = await userRepository.markVerified(userId);

  // NEW: generate a JWT now that the user has proven they own the
  // email — same shape/secret/expiry style as your login function,
  // so downstream code (middleware checking req.user, etc.) works
  // identically regardless of whether the token came from login or here.
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "super_secret_key",
    { expiresIn: "1h" }
  );

  return {
    message: "Email verified successfully.",
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = { createAndSendOtp, verifyOtp };