const { body } = require("express-validator");

const onboardingValidator = [

  body("sex")
    .notEmpty()
    .withMessage("Sex is required")
    .isIn(["M", "F", "Other"])
    .withMessage("Sex must be M, F, or Other"),


  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 16, max: 100 })
    .withMessage("Age must be between 16 and 100"),


  body("graduation_date")
    .notEmpty()
    .withMessage("Graduation date is required")
    .isISO8601()
    .withMessage("Invalid graduation date"),


  body("Bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),


  body("University")
    .notEmpty()
    .trim()
    .isLength({ max: 200 })
    .withMessage("University name cannot exceed 200 characters"),


  body("PhoneNumber")
    .notEmpty()
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Invalid phone number format"),


  body("ProfilePicture")
    .optional()
    .isURL()
    .withMessage("Profile picture must be a valid URL")

];


module.exports = {
  onboardingValidator
};