const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authenticateToken = require("../middleware/auth.middleware");
const rideParticipantController =require("../controllers/ride_participant.controller");

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

//close post
router.patch("/:id/close", authenticateToken, postController.closePost);

//join ride
router.post( "/:postId/participants", authenticateToken, rideParticipantController.joinRide
);
// Delete post
router.delete("/:id", authenticateToken, postController.deletePost);

// Get participants for a ride
router.get("/:postId/participants", authenticateToken, rideParticipantController.getParticipants);

module.exports = router;