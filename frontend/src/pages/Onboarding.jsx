import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../hooks/user.hooks";


export default function Onboarding() {
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    sex: "",
    graduation_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();

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

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="graduation_date"
            type="date"
            value={form.graduation_date}
            onChange={handleChange}
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