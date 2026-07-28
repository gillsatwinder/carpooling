import { motion } from "framer-motion";
import {
  Pencil,
  Check,
  X,
  Loader2,
} from "lucide-react";

import ProfileField from "./ProfileField";

export default function ProfileCard({
  profile,
  draft,
  isEditing,
  saving,
  error,
  successMsg,
  onChange,
  onEdit,
  onCancel,
  onSave,
  fields,
  inputMode,
  fieldErrors = {},
}) {
  const hasErrors = Object.values(fieldErrors).some(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 bg-white rounded-xl shadow-sm p-8"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center">

        {/* User Name */}
        <p className="mt-3 text-lg font-semibold text-gray-900">
          {draft.name || profile.name || "Your Name"}
        </p>

        {/* University */}
        <p className="text-sm text-gray-500">
          {draft.university || profile.university}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMsg && !isEditing && (
        <div className="mt-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
          {successMsg}
        </div>
      )}

      {/* Profile Fields */}
      <div className="mt-8 space-y-5">
        {fields.map(({ key, label, icon: Icon, type, options }) => (
          <ProfileField
            key={key}
            label={label}
            icon={Icon}
            name={key}
            value={draft[key] || ""}
            type={type}
            options={options}
            isEditing={isEditing}
            inputMode={inputMode}
            onChange={onChange}
            error={fieldErrors[key]}
          />
        ))}

   
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-3">
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={saving || hasErrors}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-md disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Check size={16} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-md"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  );
}