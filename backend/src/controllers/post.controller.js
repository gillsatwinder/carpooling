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