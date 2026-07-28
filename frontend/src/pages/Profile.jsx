import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, User, Mail, GraduationCap,Phone,FileText } from "lucide-react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileImage from "../components/profile/ProfileImage";
import { getProfile, updateProfile } from "../hooks/user.hooks";
//import { logout } from "../hooks/auth.hooks";
// Default profile object.
// These values are used before data is loaded from the backend.
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
};

const Profile = () => {
//  const navigate = useNavigate();

  // Controls whether the form is editable.
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Stores the saved profile from the backend.
  const [profile, setProfile] = useState(initialProfile);
  // Stores the user's edits before they are saved.
  const [draft, setDraft] = useState(initialProfile);



  // Fetch profile data from the backend.

  // Fetch profile once when the component loads.
  useEffect(() => {
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
    fetchProfile();
  }, []);

  // Validate a single field's value. Returns an error string, or "" if valid.
  function validateField(name, value) {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required.";

      case "email": {
        if (!value.trim()) return "Email is required.";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) ? "" : "Enter a valid email address.";
      }

      case "University":
        return value.trim() ? "" : "University is required.";

      case "age": {
        if (value === "" || value === null || value === undefined) {
          return "Age is required.";
        }
        const ageNum = Number(value);
        if (!Number.isInteger(ageNum)) return "Age must be a whole number.";
        if (ageNum < 15 || ageNum > 100) {
          return "Enter an age between 15 and 100.";
        }
        return "";
      }

      case "sex":
        return ["M", "F", "Other"].includes(value)
          ? ""
          : "Please select a gender.";

      case "graduation_date": {
        if (!value) return "";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "Enter a valid date." : "";
      }

      case "PhoneNumber": {
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length > 0 && digitsOnly.length !== 10
          ? "Enter a valid 10-digit phone number."
          : "";
      }

      case "Bio":
        return value.length > 500
          ? "Bio must be 500 characters or fewer."
          : "";

      default:
        return "";
    }
  }

  // Update the draft whenever a user types in an input.
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

  // Enter edit mode.
  function handleEditClick() {
    setDraft(profile);
    setIsEditing(true);
    setSuccessMsg("");
    setError("");
    setFieldErrors({});
  }

  // Cancel editing and restore original values.
  function handleCancel() {
    setDraft(profile);
    setIsEditing(false);
    setError("");
    setFieldErrors({});
  }

  // Save the edited profile.
  async function handleSave() {
    // Re-validate every field at submit time, in case a field was
    // never touched (and so never validated by handleChange).
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

    setSaving(true);
    // setError("");
    // setSuccessMsg("");

    try {
      const updated = await updateProfile(draft);
      console.log("UPDATED PROFILE:", updated);
      const data = updated.data;
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
 /* function handleLogout() {
    logout();
    //React Router replaces the current page in the history instead of adding a new one
    navigate("/login", { replace: true });
  }
    */

// Updates profile state after a successful profile picture upload
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
  // Fields to display inside ProfileCard..
 const fields = [
  {
    key: "name",
    label: "Name",
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
    key: "University",
    label: "University",
    icon: GraduationCap,
    type: "text",
  },

  {
    key: "age",
    label: "Age",
    icon: User,
    type: "text",
    inputMode: "numeric",
  },

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

  {
    key: "graduation_date",
    label: "Graduation Date",
    icon: GraduationCap,
    type: "date",
  },

  {
    key: "Bio",
    label: "Bio",
    icon: FileText,
    type: "textarea",
  },

  {
    key: "PhoneNumber",
    label: "Phone Number",
    icon: Phone,
    type: "text",
  },
];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     
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

        {loading ? (
          <div className="mt-12 flex justify-center text-gray-500">
            <Loader2 className="animate-spin mr-2" size={20} />
            Loading profile...
          </div>
        ) : (
          <>

    {/* Profile picture section */}
    <div className="mt-8 mb-8">
      <ProfileImage
        image={profile.ProfilePicture}
        onUploadSuccess={handleProfileImageUpdate}
      />
    </div>


    {/* Profile information section */}
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
      fieldErrors={fieldErrors}
    />

  </>
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