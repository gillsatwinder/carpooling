export default function ProfileField({
  label,
  icon: Icon,
  name,
  value,
  type = "text",
  isEditing,
  onChange,
  multiline = false,
  placeholder,
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
        <Icon size={15} className="text-purple-600" />
        {label}
      </label>

      {isEditing ? (
        multiline ? (
          <textarea
            name={name}
            rows={3}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        )
      ) : (
        <p
          className={`px-4 py-2.5 rounded-lg bg-gray-50 text-gray-800 ${
            multiline ? "whitespace-pre-wrap" : ""
          }`}
        >
          {value || <span className="text-gray-400">Not provided</span>}
        </p>
      )}
    </div>
  );
}