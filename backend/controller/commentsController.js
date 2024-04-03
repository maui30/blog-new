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

const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  const id = req.user.id;

  if (!comment) return res.status(400).json({ message: "No comment" });

  //check if user already liked the comment
  const userLiked = comment.likes.indexOf(id);

  if (userLiked === -1) {
    comment.likes.push(id);
    comment.numberOfLikes += 1;
  } else {
    comment.likes.splice(id, 1);
    comment.numberOfLikes -= 1;
  }

  await comment.save();

  res.status(200).json(comment);
});

module.exports = { createComment, getComments, likeComment };
