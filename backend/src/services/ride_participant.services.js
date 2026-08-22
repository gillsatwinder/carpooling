const postRepository = require("../repositories/post.repository");
const participantRepository = require("../repositories/ride_participant.repository");
const notificationHelper = require("../utils/notification.helper")

exports.joinRide = async (postId, userId, role) => {
  // Find the post
  const post = await postRepository.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }
  // Only open rides can be joined
  if (post.status !== "OPEN") {
    throw new Error("This ride is no longer open");
  }
  // Owner cannot join their own post
  if (post.owner_id === userId) {
    throw new Error("You cannot join your own ride");
  }
  // If the post is a ride request, the user must join as a passenger or driver
  if (post.type === "RIDE_OFFER") {
    if (role == "DRIVER") {
      throw new Error("You cannot join a ride offer as a driver");
    }
  }



  // RIDE_REQUEST -> only drivers can join
  if (post.type === "RIDE_REQUEST") {
    if (role !== "DRIVER") {
      throw new Error("You can only join ride requests as a driver");
    }

    // Check if this request already has an accepted driver
    const acceptedDriver = await participantRepository.findAcceptedDriver(
      postId
    );

    if (acceptedDriver) {
      throw new Error("This ride request already has a driver");
    }
  }




  // Check duplicate participation
  const existing = await participantRepository.findByPostAndUser(
    postId,
    userId
  );

  if (existing) {
    throw new Error("You have already joined this ride");
  }



  const participant = await participantRepository.create({
    post_id: postId,
    user_id: userId,
    role: role,
    status: "PENDING",
  });

  //notify
  await notificationHelper.notifyRideOwner(
    post.owner_id,
    participant.id,
    post.id,
    role
  );


  return participant;
};

exports.getParticipants = async (postId) => {

  const post = await postRepository.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  return await participantRepository.findAllByPost(postId);
};

exports.acceptParticipant = async (participantId, ownerId) => {

  const participant =
    await participantRepository.findById(
      participantId
    );


  if (!participant)
    throw new Error("Participant not found");


  const post =
    await postRepository.findById(
      participant.post_id
    );


  if (post.owner_id !== ownerId)
    throw new Error("Unauthorized");


  const acceptedCount =
    await participantRepository.countAccepted(
      participant.post_id
    );


  if (acceptedCount >= post.seats)
    throw new Error("No seats available");


  const updatedParticipant = await participantRepository.updateStatus(
    participantId,
    "ACCEPTED"
  );
  // Notify the person who joined
  await notificationHelper.notifyParticipantAccepted(
    participant.user_id,
    post.id,
    participant.id
  );

  return updatedParticipant;


};


// REJECT
exports.rejectParticipant = async (participantId, ownerId) => {

  const participant =
    await participantRepository.findById(
      participantId
    );


  if (!participant)
    throw new Error("Participant not found");


  const post =
    await postRepository.findById(
      participant.post_id
    );


  if (post.owner_id !== ownerId)
    throw new Error("Unauthorized");


  const updatedParticipant = await participantRepository.updateStatus(
    participantId,
    "REJECTED"
  );

  // Notify rejected participant
  await notificationHelper.notifyParticipantRejected(
    updatedParticipant.user_id,
    updatedParticipant.post_id,
    updatedParticipant.id
  );
  return updatedParticipant;


};

// MY RIDES
exports.getMyJoinedRides = async (
  userId
) => {

  return await participantRepository.findByUserId(
    userId
  );

};

// CANCEL REQUEST
exports.cancelRequest = async (
  participantId,
  userId
) => {

  const participant =
    await participantRepository.findById(
      participantId
    );


  if (!participant)
    throw new Error("Participant not found");


  if (participant.user_id !== userId)
    throw new Error("Unauthorized");


  if (participant.status !== "PENDING")
    throw new Error(
      "Only pending requests can be cancelled"
    );


  return await participantRepository.delete(
    participantId
  );

};



// LEAVE RIDE
exports.leaveRide = async (
  participantId,
  userId
) => {

  const participant =
    await participantRepository.findById(
      participantId
    );


  if (!participant)
    throw new Error("Participant not found");


  if (participant.user_id !== userId)
    throw new Error("Unauthorized");


  return await participantRepository.delete(
    participantId
  );

};
