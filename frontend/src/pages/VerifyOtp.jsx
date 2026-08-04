import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../hooks/auth.hooks";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds remaining before resend is allowed again

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // WHY we read these from location.state: Register.jsx passes them
  // via navigate("/verify-otp", { state: { userId, email } }) — this
  // is how this page knows WHO it's verifying without needing a URL param.
  const { userId, email } = location.state || {};

  // WHY this redirect: if someone lands on this page directly (e.g.
  // refreshes, or bookmarks the URL) without coming from Register,
  // there's no userId to verify — send them back to signup instead
  // of showing a broken form.
  useEffect(() => {
    if (!userId) {
      navigate("/register");
    }
  }, [userId, navigate]);

  // WHY this countdown effect: ticks the cooldown down every second
  // so the "Resend code" button re-enables itself automatically.
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp({ userId, otp });

      // WHY we log the user in here: this is the actual moment the
      // account becomes usable — verify-otp is what returns the JWT now,
      // not register.
      const token = res?.data?.token;
      const user = res?.data?.user;
      if (token) {
        login(token,false,user);
      }

      navigate("/onboarding");
    } catch (err) {
      setError(err?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");

    try {
      await resendOtp({ email });
      setResendMessage("A new code has been sent to your email.");
      setCooldown(60); // WHY 60: matches your backend's rate limit window
    } catch (err) {
      setError(err?.message || "Could not resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            We sent a 6-digit code to {email || "your email"}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="text"
            inputMode="numeric" // WHY: brings up numeric keyboard on mobile
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // WHY strip non-digits: prevents pasting/typing letters into a numeric code
            className="border border-gray-200 rounded-xl p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading || otp.length !== 6}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {resendMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm text-center"
            >
              {resendMessage}
            </motion.p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm text-purple-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}