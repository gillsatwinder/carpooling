const express = require("express");
const userController = require("../controllers/user.controller");   
const authenticateToken = require("../middleware/auth.middleware");   
const validation = require("../validators/user.validators");
const upload = require("../middleware/upload.middleware");

const router = express.Router();
router.post("/onboarding",authenticateToken,validation.onboardingValidator, userController.completeOnboarding);
router.get("/profile",authenticateToken, userController.getProfile);
router.put("/profile",authenticateToken, userController.updateProfile);
router.put("/profile/photo", authenticateToken, upload.single("profilePicture"),userController.updateProfilePicture);

module.exports = router;