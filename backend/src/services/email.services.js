const nodemailer = require("nodemailer");

// WHY a transporter object (Nodemailer's term) instead of Resend's
// client: this is Nodemailer's equivalent concept — a reusable
// connection configuration you send emails through. Created once
// at module load, same reasoning as before (avoid recreating per email).
const transporter = nodemailer.createTransport({
  service: "gmail", // WHY "gmail": Nodemailer has built-in presets for common providers, saves you specifying host/port manually
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // the 16-character App Password, NOT your real Gmail password
  },
});

// WHY this function's name/signature is unchanged from the Resend
// version: otp.services.js calls sendOtpEmail(email, otp) as a black
// box — it doesn't know or care which provider is behind it. That's
// the whole point of keeping this logic isolated in its own file.
const sendOtpEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Your verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Verify your email</h2>
          <p>Use the code below to verify your account. This code expires in 10 minutes.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f4; text-align: center; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 16px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    // WHY we throw a generic message here (matching the Resend
    // version's error style): keeps auth.services.js's error handling
    // unaffected by this swap — it just sees "Failed to send..." either way.
    throw new Error("Failed to send verification email");
  }
};

module.exports = { sendOtpEmail };