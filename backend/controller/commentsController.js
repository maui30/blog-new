const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");

const createComment = asyncHandler(async (req, res) => {
  const { content, postId, userId } = req.body;

  if (req.user.id !== userId)
    return res
      .status(400)
      .json({ message: "You are not allowed to write this comment" });

  const comment = await Comment.create({ content, postId, userId });

  if (comment) {
    res.status(200).json({ ...comment._doc, message: "Comment Created" });
  } else {
    res.status(400).json({ message: "Invalid Comment" });
  }
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });

  res.status(200).json(comments);
});

module.exports = { createComment, getComments };
