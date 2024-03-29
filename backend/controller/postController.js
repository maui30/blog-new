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

const getPosts = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const nowDate = new Date();

  const oneMonthAgo = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth() - 1,
    nowDate.getDate()
  );

  const countLastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({ posts, totalPosts, countLastMonthPosts });
});

const deletePost = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.userId)
    return res
      .status(400)
      .json({ message: "You are not allowed to delete this post" });

  const post = await Post.findById(req.params.postId);

  await post.deleteOne();

  res.status(200).json({ message: "Post deleted Successfully" });
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, image, category } = req.body;

  const slug = title
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  const updatePost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        title,
        image,
        content,
        category,
        slug,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ ...updatePost._doc, message: "Post Updated Successfully" });
});

module.exports = { createPost, getPosts, deletePost, updatePost };
