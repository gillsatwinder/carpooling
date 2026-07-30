import { useState } from "react";

export function useFormValidation(schema) {
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};

    for (const field in schema) {
      const rules = schema[field];
      for (const rule of rules) {
        const errorMessage = rule(values[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
          break; // stop at first failing rule for this field
        }
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  const clearErrors = () => setErrors({});

  return { errors, validate, clearErrors };
}