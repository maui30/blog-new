const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const createPost = asyncHandler(async (req, res) => {
  const { userId, title, content, image, category, slug } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and Content is required" });
  }
});
