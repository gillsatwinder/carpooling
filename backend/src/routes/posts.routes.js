const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authenticateToken = require("../middleware/auth.middleware");

// Create post
router.post("/", authenticateToken, postController.createPost);

// Get all posts (with optional filters)
router.get("/", postController.getAllPosts);

// Get my posts
router.get("/me", authenticateToken, postController.getMyPosts);

// Get single post
router.get("/:id", postController.getPostById);

// Update post
router.put("/:id", authenticateToken, postController.updatePost);

// Cancel post
router.patch("/:id/cancel", authenticateToken, postController.cancelPost);

module.exports = router;