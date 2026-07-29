import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../hooks/user.hooks";
import {useAuth} from "../context/useAuth";


export default function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    graduation_date: "",
    Bio: "",
    University: "",
    PhoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitOnboarding(form);

      completeOnboarding();
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          Complete Profile 🎓
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Help us set up your carpool profile
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

           {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />


          {/* Age */}
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />


          {/* Gender */}
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value=""> Select Gender</option>
            <option value="M">  Male</option>
            <option value="F"> Female</option>
            <option value="Other"> Other</option>
          </select>


            {/* Graduation Date with placeholder overlay */}
          <div className="relative">

            <input
              name="graduation_date"
              type="date"
              value={form.graduation_date}
              onChange={handleChange}
                className={`border rounded-lg p-3 w-full ${
               !form.graduation_date ? "text-transparent" : "text-gray-700"
               }`}
             />

            {!form.graduation_date && (
              <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                Expected Graduation Date
              </span>
            )}

          </div>

          {/* University */}
          <input
            name="University"
            placeholder="University"
            value={form.University}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />


          {/* Phone Number */}
          <input
            name="PhoneNumber"
            placeholder="Phone Number"
            value={form.PhoneNumber}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />


          {/* Bio */}
          <textarea
            name="Bio"
            placeholder="Tell us about yourself"
            value={form.Bio}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            className="border rounded-lg p-3"
          />


          <button
            disabled={loading}
            className="bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish Setup"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

      </div>
    </div>
  );
}