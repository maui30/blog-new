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

const editComment = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const comment = await Comment.findById(req.params.commentId);

  if (!comment) return res.status(400).json({ message: "No Comment" });

  if (id !== comment.userId)
    return res.status(403).json({ message: "Not allowed to edit" });

  const updateComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $set: {
        content: req.body.content,
      },
    },
    { new: true }
  );

  res.status(200).json({
    ...updateComment._doc,
    message: "Comment Updated",
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) return res.status(404).json({ message: "Comment not Found" });

  if (req.user.id !== comment.userId && !req.user.isAdmin)
    return res.status(403).json({ message: "You are not allowed to delete" });

  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(200).json({ message: "Comment Deleted" });
});

const getAllComments = asyncHandler(async (req, res) => {
  // if (!req.user.isAdmin)
  //   return res.status(403).json({ message: "Unauthorized" });

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;

  const comments = await Comment.find()
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComment = await Comment.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({ comments, totalComment, lastMonthComments });
});

module.exports = {
  createComment,
  getComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
};
