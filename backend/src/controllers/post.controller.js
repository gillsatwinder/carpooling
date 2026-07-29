const postService = require("../services/post.services");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware
    const post = await postService.createPost(userId, req.body);

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts(req.query);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await postService.getMyPosts(userId);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await postService.updatePost(req.params.id, userId, req.body);

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await postService.cancelPost(req.params.id, userId);

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.closePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await postService.closePost(req.params.id, userId);

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await postService.deletePost(id, userId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};