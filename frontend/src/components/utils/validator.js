export function isRequired(value) {
  if (value === null || value === undefined) return "This field is required";
  if (typeof value === "string" && value.trim() === "") {
    return "This field is required";
  }
  return null;
}

export function isValidAge(value, min = 15, max = 100) {
  if (value === "" || value === null || value === undefined) return null; // let isRequired handle empty
  const num = Number(value);
  if (Number.isNaN(num)) return "Age must be a number";
  if (!Number.isInteger(num)) return "Age must be a whole number";
  if (num < min || num > max) {
    return `Age must be between ${min} and ${max}`;
  }
  return null;
}

export function isOneOf(value, allowedValues) {
  if (value === "" || value === null || value === undefined) return null; // let isRequired handle empty
  if (!allowedValues.includes(value)) {
    return `Value must be one of: ${allowedValues.join(", ")}`;
  }
  return null;
}

// Digits-only, 10-digit US phone number (matches how Profile.jsx stores PhoneNumber)
export function isValidPhoneNumber(value) {
  if (value === "" || value === null || value === undefined) return null; // optional field
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length !== 10) {
    return "Enter a valid 10-digit phone number";
  }
  return null;
}

export function isValidLength(value, max) {
  if (value === "" || value === null || value === undefined) return null;
  if (value.length > max) {
    return `Must be ${max} characters or fewer`;
  }
  return null;
}

export function isValidDate(value) {
  if (value === "" || value === null || value === undefined) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Enter a valid date";
  }
  return null;
}

export function isValidEmail(value) {
  if (value === "" || value === null || value === undefined) return null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    return "Enter a valid email address";
  }
  return null;
}