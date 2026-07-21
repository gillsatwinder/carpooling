import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, User, Mail, GraduationCap } from "lucide-react";
import ProfileCard from "../components/profile/ProfileCard";
import { getProfile, updateProfile } from "../hooks/user.hooks";
import { logout } from "../hooks/auth.hooks";

// Default profile object.
// These values are used before data is loaded from the backend.
const initialProfile = {
  name: "",
  email: "",
  university: "",
  bio: "",
};

const Profile = () => {
  const navigate = useNavigate();

  // Controls whether the form is editable.
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Stores the saved profile from the backend.
  const [profile, setProfile] = useState(initialProfile);
  // Stores the user's edits before they are saved.
  const [draft, setDraft] = useState(initialProfile);

  // Fetch profile once when the component loads.
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile data from the backend.
  async function fetchProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await getProfile();
       const data = response.data;
      // Merge backend data with default values.
      // This prevents missing fields from becoming undefined.
      const profileData = {
        ...initialProfile,
        ...data,
      };

      setProfile(profileData);
      setDraft(profileData);
    } catch (err) {
      console.error(err);
      setError("Couldn't load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Update the draft whenever a user types in an input.
  function handleChange(e) {
    const { name, value } = e.target;

    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Enter edit mode.
  function handleEditClick() {
    setDraft(profile);
    setIsEditing(true);
    setSuccessMsg("");
    setError("");
  }

  // Cancel editing and restore original values.
  function handleCancel() {
    setDraft(profile);
    setIsEditing(false);
    setError("");
  }

  // Save the edited profile.
  async function handleSave() {
    setSaving(true);
   // setError("");
   // setSuccessMsg("");

    try {
      const updated = await updateProfile(draft);
        console.log("UPDATED PROFILE:", updated);
      const data=updated.data;
      // Keep profile and draft synchronized.
      setProfile(data);
      setDraft(data);

      setIsEditing(false);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Navigate back to the login page.
  function handleLogout() {
    logout();
    //React Router replaces the current page in the history instead of adding a new one
    navigate("/login",{ replace: true });
  }

  // Fields to display inside ProfileCard.
  // Removed Phone and Avatar fields.
  const fields = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      type: "text",
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      type: "email",
    },
    {
      key: "university",
      label: "University",
      icon: GraduationCap,
      type: "text",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1
          className="text-xl font-bold text-purple-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          NeedRide 🚗
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 hover:text-black text-gray-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1.5 text-purple-600 font-medium"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-red-600 text-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 text-center"
        >
          Your Profile
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-gray-600 text-center"
        >
          View and update your personal information.
        </motion.p>

        {/* Show loading spinner while fetching profile */}
        {loading ? (
          <div className="mt-12 flex justify-center text-gray-500">
            <Loader2 className="animate-spin mr-2" size={20} />
            Loading profile...
          </div>
        ) : (
          <ProfileCard
            profile={profile}
            draft={draft}
            isEditing={isEditing}
            saving={saving}
            error={error}
            successMsg={successMsg}
            onChange={handleChange}
            onEdit={handleEditClick}
            onCancel={handleCancel}
            onSave={handleSave}
            fields={fields}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NeedRide
      </div>
    </div>
  );
};

export default Profile;