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

// Owner accepts participant
exports.acceptParticipant = async (req, res) => {
  try {

    const participant =
      await rideParticipantService.acceptParticipant(
        req.params.participantId,
        req.user.id
      );

    res.json(participant);

  } catch(err) {
    res.status(400).json({
      error: err.message
    });
  }
};


// Owner rejects participant
exports.rejectParticipant = async (req, res) => {
  try {

    const participant =
      await rideParticipantService.rejectParticipant(
        req.params.participantId,
        req.user.id
      );

    res.json(participant);

  } catch(err) {
    res.status(400).json({
      error: err.message
    });
  }
};



// Passenger cancels request
exports.cancelRequest = async (req,res)=>{
  try {

    const participant =
      await rideParticipantService.cancelRequest(
        req.params.participantId,
        req.user.id
      );

    res.json(participant);

  }catch(err){

    res.status(400).json({
      error: err.message
    });

  }
};



// Passenger leaves ride
exports.leaveRide = async(req,res)=>{
  try{

    const participant =
      await rideParticipantService.leaveRide(
        req.params.participantId,
        req.user.id
      );


    res.json(participant);


  }catch(err){

    res.status(400).json({
      error:err.message
    });

  }
};



// Get user's joined rides
exports.getMyJoinedRides = async(req,res)=>{
  try{

    const rides =
      await rideParticipantService.getMyJoinedRides(
        req.user.id
      );


    res.json(rides);


  }catch(err){

    res.status(400).json({
      error:err.message
    });

  }
};