import {
  isRequired,
  isValidAge,
  isOneOf,
  isValidPhoneNumber,
  isValidLength,
  isValidDate,
  isValidEmail,
} from "../utils/validator";

export const profileSchema = {
  name: [isRequired],
  email: [isRequired, isValidEmail],
  University: [isRequired],
  age: [isRequired, (v) => isValidAge(v, 15, 100)],
  sex: [isRequired, (v) => isOneOf(v, ["M", "F", "Other"])],
  graduation_date: [isValidDate],
  PhoneNumber: [isValidPhoneNumber],
  Bio: [(v) => isValidLength(v, 500)],
  role: [isRequired, (v) => isOneOf(v, ["DRIVER", "PASSENGER", "BOTH"])],
};