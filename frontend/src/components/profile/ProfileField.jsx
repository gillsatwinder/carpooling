export default function ProfileField({
  label,
  icon: Icon,
  name,
  value,
  type = "text",
  isEditing,
  onChange,
  placeholder,
  options = [],
  error,
}) {
  const isTextarea = type === "textarea";
  const isSelect = type === "select";

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
        <Icon size={15} className="text-purple-600" />
        {label}
      </label>

      {isEditing ? (
        isTextarea ? (
          <textarea
            name={name}
            rows={3}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
              error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
            }`}
          />
        ) : isSelect ? (
          <select
            name={name}
            value={value || ""}
            onChange={onChange}
            aria-invalid={!!error}
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent bg-white ${
              error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
            }`}
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={type === "date" && value ? value.split("T")[0] : value || ""}
            onChange={onChange}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent ${
              error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
            }`}
          />
        )
      ) : (
        <p
          className={`px-4 py-2.5 rounded-lg bg-gray-50 text-gray-800 ${
            isTextarea ? "whitespace-pre-wrap" : ""
          }`}
        >
          {value ? (
            type === "date" ? (
              new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            ) : isSelect ? (
              options.find((opt) => opt.value === value)?.label || value
            ) : (
              value
            )
          ) : (
            <span className="text-gray-400">Not provided</span>
          )}
        </p>
      )}

      {isEditing && error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}