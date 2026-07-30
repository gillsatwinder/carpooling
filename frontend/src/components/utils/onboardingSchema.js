import {
  isRequired,
  isValidAge,
  isOneOf,
  isValidPhoneNumber,
  isValidLength,
  isValidDate,
} from "../utils/validator";

export const onboardingSchema = {
  name: [isRequired],
  age: [isRequired, (v) => isValidAge(v, 15, 100)],
  sex: [isRequired, (v) => isOneOf(v, ["M", "F", "Other"])],
  graduation_date: [isValidDate],
  Bio: [(v) => isValidLength(v, 500)],
  University: [],
  PhoneNumber: [isValidPhoneNumber],
  role: [isRequired, (v) => isOneOf(v, ["DRIVER", "PASSENGER", "BOTH"])],
};