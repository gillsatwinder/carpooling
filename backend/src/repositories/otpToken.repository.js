const { OtpToken } = require("../models"); // pulls from your models/index.js

// queries for otp_tokens. No business logic here, just data access.

// WHY we invalidate old OTPs before creating a new one: a freshly
// requested OTP should make any previous unused one immediately stop 
//  working (e.g. user clicks "resend" — the old code shouldn't still work).
const invalidateActiveOtps = async (userId) => {
  await OtpToken.update(
    { used_at: new Date() },
    { where: { user_id: userId, used_at: null } }
  );
};

const create = async ({ user_id, otp_hash, expires_at }) => {
  return await OtpToken.create({ user_id, otp_hash, expires_at });
};

// WHY order by created_at DESC: if multiple unused OTPs ever exist
// (shouldn't happen given invalidateActiveOtps, but defensive), this
// guarantees we always check against the newest one.
const findLatestActive = async (userId) => {
  return await OtpToken.findOne({
    where: { user_id: userId, used_at: null },
    order: [["created_at", "DESC"]],
  });
};

const incrementAttempts = async (id) => {
  await OtpToken.increment("attempts", { where: { id } });
};

const markUsed = async (id) => {
  await OtpToken.update({ used_at: new Date() }, { where: { id } });
};

module.exports = {
  invalidateActiveOtps,
  create,
  findLatestActive,
  incrementAttempts,
  markUsed,
};