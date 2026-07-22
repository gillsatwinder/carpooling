const express = require("express");
const router = express.Router();

const rideParticipantController = require("../controllers/ride_participant.controller");
const authenticateToken = require("../middleware/auth.middleware");


// Owner accepts passenger
router.patch(
  "/:participantId/accept",
  authenticateToken,
  rideParticipantController.acceptParticipant
);


// Owner rejects passenger
router.patch(
  "/:participantId/reject",
  authenticateToken,
  rideParticipantController.rejectParticipant
);


// Passenger cancels join request
router.patch(
  "/:participantId/cancel",
  authenticateToken,
  rideParticipantController.cancelRequest
);


// Passenger leaves accepted ride
router.delete(
  "/:participantId",
  authenticateToken,
  rideParticipantController.leaveRide
);


// Get rides where user has joined
router.get(
  "/my-rides",
  authenticateToken,
  rideParticipantController.getMyJoinedRides
);


module.exports = router;