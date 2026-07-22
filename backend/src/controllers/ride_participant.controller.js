const rideParticipantService = require("../services/ride_participant.services");

exports.joinRide = async (req, res) => {
  try {
    const participant = await rideParticipantService.joinRide(
      req.params.postId,
      req.user.id
    );

    res.status(201).json(participant);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });

  }
};

exports.getParticipants = async (req, res) => {
   
  try {
    const participants =
      await rideParticipantService.getParticipants(
        req.params.postId
      );

    res.status(200).json(participants);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  
  }
};