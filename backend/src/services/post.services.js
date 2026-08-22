const postRepository = require("../repositories/post.repository");
const notificationHelper = require("../utils/notification.helper")
const participantRepository = require("../repositories/ride_participant.repository")
const sequelize = require("../config/database");

exports.createPost = async (userId, data) => {
  const post = await postRepository.create({
    ...data,
    owner_id: userId,
    status: "OPEN",
  });
  // Only notify drivers for ride requests
  if (post.type === "RIDE_REQUEST") {

    await notificationHelper.notifyDriversAboutRideRequest(post);

  }


  return post;
};

exports.getAllPosts = async (filters) => {
  return await postRepository.findAll(filters);
};

exports.getMyPosts = async (userId) => {
  return await postRepository.findByUserId(userId);
};

exports.getPostById = async (id) => {
  const post = await postRepository.findById(id);
  if (!post) throw new Error("Post not found");
  return post;
};

exports.updatePost = async (id, userId, data) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  if (post.owner_id !== userId) throw new Error("Unauthorized");

  return await postRepository.update(id, data);
};

exports.cancelPost = async (id, userId) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  if (post.owner_id !== userId) throw new Error("Unauthorized");

  const updatedPost = await postRepository.update(id, { status: "CANCELLED" });
  const participants =
    await participantRepository.findAllByPost(id);


  await notificationHelper.notifyRideStatusChanged(
    participants,
    id,
    "CANCELLED"
  );
  return updatedPost;
};

exports.closePost = async (id, userId) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  if (post.owner_id !== userId) throw new Error("Unauthorized");

  const updatedPost = await postRepository.update(id, { status: "CLOSED" });
  const participants =
    await participantRepository.findAllByPost(id);

  await notificationHelper.notifyRideStatusChanged(
    participants,
    id,
    "CLOSED"
  );
  return updatedPost;
};
exports.deletePost = async (id, userId) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  // Ensure the logged-in user owns the post
  if (post.owner_id !== userId) {
    const error = new Error("You are not authorized to delete this post");
    error.statusCode = 403;
    throw error;
  }
  return await postRepository.delete(id);
};


exports.searchPosts = async ({
  lat,
  lng,
  radius,
  date,
}) => {

  const posts = await postRepository.searchNearbyPosts({
    lat,
    lng,
    radius,
    date
  });

  const nearbyPosts = posts.filter(
    (post) => Number(post.get("distance")) <= radius
  );
  return nearbyPosts;

};

exports.convertToOffer = async (
  postId,
  driverId,
  seats,
  price
) => {

  const request =
    await postRepository.findById(postId);


  if (!request)
    throw new Error("Ride request not found");


  if (request.type !== "RIDE_REQUEST")
    throw new Error("Only requests can be converted");


  if (!request.allow_carpool)
    throw new Error("Carpooling is not allowed");


  // verify driver is accepted
  const driverParticipant =
    await participantRepository.findAcceptedDriver(
      postId,
      driverId
    );


  if (!driverParticipant)
    throw new Error(
      "Driver is not accepted for this request"
    );
  if (!seats || seats <= 0) {
    throw new Error("Seats must be greater than zero");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  // create new offer
  const transaction = await sequelize.transaction();

  const offer =
    await postRepository.create({

      type: "RIDE_OFFER",

      owner_id: driverId,

      title: request.title,

      description: request.description,

      pickup_location:
        request.pickup_location,

      pickup_lat:
        request.pickup_lat,

      pickup_lng:
        request.pickup_lng,


      destination:
        request.destination,

      destination_lat:
        request.destination_lat,

      destination_lng:
        request.destination_lng,


      ride_datetime:
        request.ride_datetime,


      seats,

      price

    },
    { transaction }
  );



  // Add original requester as passenger
  await participantRepository.create({
    post_id: offer.id,
    user_id: request.owner_id,
    role: "PASSENGER",
    status: "ACCEPTED"
  },
  { transaction }
);


  // close old request
  await postRepository.update(
    postId,
    {
      status: "CLOSED"
    },
    { transaction }
  );

  await transaction.commit();


  return offer;

};