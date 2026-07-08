import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, GraduationCap } from "lucide-react";
import ProfileCard from "../components/profile/ProfileCard";

// TODO: point these at your real backend routes
const PROFILE_ENDPOINT = "/api/user/profile";
const AVATAR_ENDPOINT = "/api/user/profile/avatar";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  university: "",
  bio: "",
  avatarUrl: "",
};

const Profile =() => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(PROFILE_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setProfile(data);
      setDraft(data);
    } catch (err) {
      setError("Couldn't load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditClick() {
    setDraft(profile);
    setIsEditing(true);
    setSuccessMsg("");
    setError("");
  }

  function handleCancel() {
    setDraft(profile);
    setIsEditing(false);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(PROFILE_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const updated = await res.json();
      setProfile(updated);
      setDraft(updated);
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleAvatarClick() {
    if (isEditing) fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, avatarUrl: previewUrl }));

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(AVATAR_ENDPOINT, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload photo");

      const data = await res.json();
      setDraft((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
    } catch (err) {
      setError("Couldn't upload your photo. Please try again.");
    }
  }

  function handleLogout() {
    navigate("/login");
  }

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text" },
    { key: "email", label: "Email", icon: Mail, type: "email" },
    { key: "phone", label: "Phone", icon: Phone, type: "tel" },
    { key: "university", label: "University", icon: GraduationCap, type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            onAvatarClick={handleAvatarClick}
            onAvatarChange={handleAvatarChange}
            fileInputRef={fileInputRef}
            fields={fields}
          />
        )}
      </div>

      <div className="mt-8 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NeedRide
      </div>
    </div>
  );
}

export default Profile;