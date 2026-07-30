import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, User, Mail, GraduationCap, Phone, FileText, Car } from "lucide-react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileImage from "../components/profile/ProfileImage";
import Modal from "../components/Modal";
import { getProfile, updateProfile } from "../hooks/user.hooks";
import { profileSchema } from "../components/utils/profileSchema";

const initialProfile = {
  name: "",
  email: "",
  sex: "",
  age: "",
  graduation_date: "",
  Bio: "",
  University: "",
  PhoneNumber: "",
  ProfilePicture: "",
  role: "",
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showNotificationDisclaimer, setShowNotificationDisclaimer] = useState(false);

  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await getProfile();
        const data = response.data;
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
    fetchProfile();
  }, []);

  function validateField(name, value) {
    const rules = profileSchema[name];
    if (!rules) return "";

    for (const rule of rules) {
      const message = rule(value);
      if (message) return message;
    }
    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "PhoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setDraft((prev) => ({ ...prev, PhoneNumber: digitsOnly }));
      setFieldErrors((prev) => ({
        ...prev,
        PhoneNumber: validateField("PhoneNumber", digitsOnly),
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }

  // A plain check, no event needed
  function shouldShowNotificationDisclaimer(roleValue) {
    return roleValue === "DRIVER" || roleValue === "BOTH";
  }


  // Generic blur handler across all fields; only acts on "role".
  function handleFieldBlur(e) {
    const { name, value } = e.target;
    if (name === "role" && shouldShowNotificationDisclaimer(value)){
      setShowNotificationDisclaimer(true);
    }
  }

  function handleEditClick() {
    setDraft(profile);
    setIsEditing(true);
    setSuccessMsg("");
    setError("");
    setFieldErrors({});
  }

  function handleCancel() {
    setDraft(profile);
    setIsEditing(false);
    setError("");
    setFieldErrors({});
  }

  async function handleSave() {
    const newErrors = {};
    fields.forEach(({ key }) => {
      newErrors[key] = validateField(key, draft[key] ?? "");
    });
    setFieldErrors(newErrors);
    
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setError("Please fix the errors above before saving.");
      return;
    }
     
    const roleChanged = draft.role !== profile.role;
      if (roleChanged && shouldShowNotificationDisclaimer(draft.role)) {
        setShowNotificationDisclaimer(true);
        return; // stop here — wait for "Got it" before actually saving
  }
    await actuallySave();
}

async function actuallySave() {
    setSaving(true);

    try {
      const updated = await updateProfile(draft);
      const data = updated.data;
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

  function handleProfileImageUpdate(updatedUser) {
    setProfile((prev) => ({
      ...prev,
      ProfilePicture: updatedUser.ProfilePicture,
    }));

    setDraft((prev) => ({
      ...prev,
      ProfilePicture: updatedUser.ProfilePicture,
    }));
  }

  const fields = [
    { key: "name", label: "Name", icon: User, type: "text" },
    { key: "email", label: "Email", icon: Mail, type: "email" },
    { key: "University", label: "University", icon: GraduationCap, type: "text" },
    { key: "age", label: "Age", icon: User, type: "text", inputMode: "numeric" },
    {
      key: "sex",
      label: "Gender",
      icon: User,
      type: "select",
      options: [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
    { key: "graduation_date", label: "Graduation Date", icon: GraduationCap, type: "date" },
    { key: "Bio", label: "Bio", icon: FileText, type: "textarea" },
    { key: "PhoneNumber", label: "Phone Number", icon: Phone, type: "text" },
    {
      key: "role",
      label: "Role",
      icon: Car,
      type: "select",
      options: [
        { value: "DRIVER", label: "Driver" },
        { value: "PASSENGER", label: "Passenger" },
        { value: "BOTH", label: "Both" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
          <>
            <div className="mt-8 mb-8">
              <ProfileImage
                image={profile.ProfilePicture}
                onUploadSuccess={handleProfileImageUpdate}
              />
            </div>

            <ProfileCard
              profile={profile}
              draft={draft}
              isEditing={isEditing}
              saving={saving}
              error={error}
              successMsg={successMsg}
              onChange={handleChange}
              onFieldBlur={handleFieldBlur}
              onEdit={handleEditClick}
              onCancel={handleCancel}
              onSave={handleSave}
              fields={fields}
              fieldErrors={fieldErrors}
            />

            <Modal
              isOpen={showNotificationDisclaimer}
              onClose={async () => {
                setShowNotificationDisclaimer(false);
                await actuallySave();
  }}
            >
              <h2 id="modal-title">Heads up</h2>
              <p>
                As a driver, you'll receive notifications when passengers request rides
                matching your route.
              </p>
            </Modal>
          </>
        )}
      </div>

      <div className="mt-8 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NeedRide
      </div>
    </div>
  );
};

export default Profile;