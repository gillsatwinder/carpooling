const postRepository = require("../repositories/post.repository");
const notificationHelper = require("../utils/notification.helper")
const participantRepository= require("../repositories/ride_participant.repository")

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