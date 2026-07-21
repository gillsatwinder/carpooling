const postRepository = require("../repositories/post.repository");

exports.createPost = async (userId, data) => {
  return await postRepository.create({
    ...data,
    user_id: userId,
    status: "OPEN",
  });
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
  if (post.user_id !== userId) throw new Error("Unauthorized");

  return await postRepository.update(id, data);
};

exports.cancelPost = async (id, userId) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  if (post.user_id !== userId) throw new Error("Unauthorized");

  return await postRepository.update(id, { status: "CANCELLED" });
};

exports.closePost = async (id, userId) => {
  const post = await postRepository.findById(id);

  if (!post) throw new Error("Post not found");
  if (post.user_id !== userId) throw new Error("Unauthorized");

  return await postRepository.update(id, { status: "CLOSED" });
};