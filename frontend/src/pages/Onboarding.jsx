import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../hooks/user.hooks";
import { useAuth } from "../context/useAuth";
import Modal from "../components/Modal";
import { useFormValidation } from "../hooks/useformValidation";
import { onboardingSchema } from "../components/utils/onboardingSchema";

export default function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    graduation_date: "",
    Bio: "",
    University: "",
    PhoneNumber: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotificationDisclaimer, setShowNotificationDisclaimer] = useState(false);

  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const { errors, validate } = useFormValidation(onboardingSchema);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { isValid } = validate(form);
    if (!isValid) {
      return;
    }

    setLoading(true);

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

  const handleRoleBlur = (e) => {
    const value = e.target.value;
    if (value === "DRIVER" || value === "BOTH") {
      setShowNotificationDisclaimer(true);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

           {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value=""> Select Gender</option>
              <option value="M">  Male</option>
              <option value="F"> Female</option>
              <option value="Other"> Other</option>
            </select>
            {errors.sex && (
              <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
            )}
          </div>

            {/* Graduation Date with placeholder overlay */}
          <div>
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
            {errors.graduation_date && (
              <p className="text-red-500 text-sm mt-1">{errors.graduation_date}</p>
            )}
          </div>

          {/* University */}
          <div>
            <input
              name="University"
              placeholder="University"
              value={form.University}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
            {errors.University && (
              <p className="text-red-500 text-sm mt-1">{errors.University}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              name="PhoneNumber"
              placeholder="Phone Number"
              value={form.PhoneNumber}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
            {errors.PhoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.PhoneNumber}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <textarea
              name="Bio"
              placeholder="Tell us about yourself"
              value={form.Bio}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              className="border rounded-lg p-3 w-full"
            />
            {errors.Bio && (
              <p className="text-red-500 text-sm mt-1">{errors.Bio}</p>
            )}
          </div>

           {/* role */}
          <div>
            <select
              name="role"
              onBlur={handleRoleBlur}
              value={form.role}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value=""> Select Role</option>
              <option value="DRIVER"> Driver  </option>
              <option value="PASSENGER"> Passenger</option>
              <option value="BOTH"> Both</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <Modal
            isOpen={showNotificationDisclaimer}
            onClose={() => setShowNotificationDisclaimer(false)}
          >
            <h2 id="modal-title">Heads up</h2>
            <p>
              As a driver, you'll receive notifications when passengers request rides
              matching your route.
            </p>
          </Modal>

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