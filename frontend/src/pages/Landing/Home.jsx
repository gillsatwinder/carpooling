import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAV */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-purple-600">
          NeedRide 🚗
        </h1>

        <div className="flex gap-4 text-sm">
          <button onClick={() => navigate("/dashboard")} className="hover:text-black text-gray-600">
            Dashboard
          </button>
          <button onClick={() => navigate("/profile")} className="hover:text-black text-gray-600">
            Profile
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900"
        >
          Smarter Student Carpooling
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 text-lg"
        >
          Find rides, offer seats, and travel safely within your university network.
        </motion.p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate("/login")}
          className="px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-lg border border-purple-600 text-purple-600 font-semibold hover:bg-purple-100 transition"
          >
            Sign Up
          </button>
      </div>
      </div>

      {/* TRUST BANNER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3 justify-center text-purple-700">
          <ShieldCheck size={18} />
          Verified university-only platform — safe student rides
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="max-w-5xl mx-auto px-6 mt-10 grid md:grid-cols-3 gap-6">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <ShieldCheck className="text-purple-600" />
          <h3 className="font-semibold mt-3">Verified Students</h3>
          <p className="text-sm text-gray-600 mt-1">
            Only university emails allowed.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <MapPin className="text-purple-600" />
          <h3 className="font-semibold mt-3">Smart Matching</h3>
          <p className="text-sm text-gray-600 mt-1">
            Find rides by route, time, and location.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <MessageCircle className="text-purple-600" />
          <h3 className="font-semibold mt-3">Real-time Chat</h3>
          <p className="text-sm text-gray-600 mt-1">
            Talk directly with drivers/passengers.
          </p>
        </motion.div>

      </div>

      {/* RIDE LIST */}
      {/* FOOTER */}
      <div className="mt-16 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NeedRide
      </div>

    </div>
  );
}