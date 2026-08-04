const crypto = require("crypto");

// WHY crypto.randomInt instead of Math.random():
// Math.random() is not cryptographically secure. For anything security-sensitive (OTPs, tokens), Node's built-in `crypto` module must be used instead.
function generateOtp() {
  // WHY 100000-999999: guarantees a 6-digit code every time (avoids leading-zero issues like "012345" showing as "12345").
  return crypto.randomInt(100000, 999999).toString();
}

// WHY we hash the OTP before storing it (same principle as password hashing):
// if your database is ever leaked, raw OTPs would let an attacker verify ANY unverified account. Hashing makes leaked data useless without the raw code, which only ever exists in the user's inbox.
// WHY HMAC with a secret (not plain hashing): adds a server-side-only
// "pepper" (OTP_HASH_SECRET). Even if the hashing method is known, an attacker without that secret can't forge a valid hash.
function hashOtp(otp) {
  return crypto
    .createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(otp)
    .digest("hex");
}

// WHY a constant-time comparison instead of `===`:
// Regular string comparison exits early at the first mismatched character, meaning comparison time subtly varies based on how much matched. In theory this can leak info via timing analysis.
// timingSafeEqual always takes the same time regardless of where the mismatch is, closing that gap.
function verifyOtpHash(inputOtp, storedHash) {
  const inputHash = hashOtp(inputOtp);
  const inputBuffer = Buffer.from(inputHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  // WHY this check: timingSafeEqual throws if buffer lengths differ, so we guard against that instead of letting it crash.
  if (inputBuffer.length !== storedBuffer.length) return false;

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}

module.exports = { generateOtp, hashOtp, verifyOtpHash };