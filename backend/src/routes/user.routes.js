const express = require("express");
const userController = require("../controllers/user.controller");   
const authenticateToken = require("../middleware/auth.middleware");   


const router = express.Router();
router.post("/onboarding",authenticateToken, userController.completeOnboarding);
router.get("/profile",authenticateToken, userController.getProfile);
router.put("/profile",authenticateToken, userController.updateProfile);

module.exports = router;