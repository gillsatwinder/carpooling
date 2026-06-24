const express = require("express");
const userController = require("../controllers/user.controller");   
const authenticateToken = require("../middleware/auth.middleware");   


const router = express.Router();
router.post("/onboarding",authenticateToken, userController.completeOnboarding);


module.exports = router;