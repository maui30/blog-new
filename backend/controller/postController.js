const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const createPost = asyncHandler(async (req, res) => {
  const { title, content, image, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and Content is required" });
  }

  const slug = title
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  const postObj = {
    userId: req.user.id,
    title,
    content,
    image,
    category,
    slug,
  };

  const post = await Post.create(postObj);

  if (post) {
    res.status(200).json({ ...post, message: "Post successfully created" });
  } else {
    res.status(400).json({ message: "Invalid Post" });
  }
});

module.exports = { createPost };
