const postController = require("../controllers/post.controller");
const postService = require("../services/post.services");

jest.mock("../services/post.services");

describe("Post Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: {
        id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a post", async () => {
      const post = { id: 1, title: "Ride Offer" };

      req.body = { title: "Ride Offer" };
      postService.createPost.mockResolvedValue(post);

      await postController.createPost(req, res);

      expect(postService.createPost).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it("should return 500 if service throws", async () => {
      postService.createPost.mockRejectedValue(new Error("Database Error"));

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      const posts = [{ id: 1 }, { id: 2 }];

      req.query = { type: "RIDE_OFFER" };

      postService.getAllPosts.mockResolvedValue(posts);

      await postController.getAllPosts(req, res);

      expect(postService.getAllPosts).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it("should return 500 if service throws", async () => {
      postService.getAllPosts.mockRejectedValue(new Error("Database Error"));

      await postController.getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("getMyPosts", () => {
    it("should return user's posts", async () => {
      const posts = [{ id: 1 }];

      postService.getMyPosts.mockResolvedValue(posts);

      await postController.getMyPosts(req, res);

      expect(postService.getMyPosts).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it("should return 500 if service throws", async () => {
      postService.getMyPosts.mockRejectedValue(new Error("Database Error"));

      await postController.getMyPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("getPostById", () => {
    it("should return a post", async () => {
      const post = { id: 1 };

      req.params.id = 1;

      postService.getPostById.mockResolvedValue(post);

      await postController.getPostById(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it("should return 500 if service throws", async () => {
      req.params.id = 1;

      postService.getPostById.mockRejectedValue(new Error("Database Error"));

      await postController.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("updatePost", () => {
    it("should update a post", async () => {
      const updatedPost = { id: 1, title: "Updated Ride" };

      req.params.id = 1;
      req.body = { title: "Updated Ride" };

      postService.updatePost.mockResolvedValue(updatedPost);

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith(
        1,
        1,
        req.body
      );
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it("should return 500 if service throws", async () => {
      req.params.id = 1;

      postService.updatePost.mockRejectedValue(new Error("Database Error"));

      await postController.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("cancelPost", () => {
    it("should cancel a post", async () => {
      const cancelledPost = {
        id: 1,
        status: "CANCELLED",
      };

      req.params.id = 1;

      postService.cancelPost.mockResolvedValue(cancelledPost);

      await postController.cancelPost(req, res);

      expect(postService.cancelPost).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(cancelledPost);
    });

    it("should return 500 if service throws", async () => {
      req.params.id = 1;

      postService.cancelPost.mockRejectedValue(new Error("Database Error"));

      await postController.cancelPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("closePost", () => {
    it("should close a post", async () => {
      const closedPost = {
        id: 1,
        status: "CLOSED",
      };

      req.params.id = 1;

      postService.closePost.mockResolvedValue(closedPost);

      await postController.closePost(req, res);

      expect(postService.closePost).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(closedPost);
    });

    it("should return 500 if service throws", async () => {
      req.params.id = 1;

      postService.closePost.mockRejectedValue(new Error("Database Error"));

      await postController.closePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database Error",
      });
    });
  });

  describe("deletePost", () => {
    it("should delete a post successfully", async () => {
      const deletedPost = {
        id: 1,
        status: "DELETED",
      };

      req.params.id = 1;

      postService.deletePost.mockResolvedValue(deletedPost);

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith(1, 1);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Post deleted successfully",
        data: deletedPost,
      });
    });

    it("should return custom status code if service throws one", async () => {
      req.params.id = 1;

      const error = new Error("Post not found");
      error.statusCode = 404;

      postService.deletePost.mockRejectedValue(error);

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith(1, 1);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Post not found",
      });
    });

    it("should return 500 if service throws without statusCode", async () => {
      req.params.id = 1;

      postService.deletePost.mockRejectedValue(
        new Error("Internal Server Error")
      );

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith(1, 1);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });
    });
  });
});