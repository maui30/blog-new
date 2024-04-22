const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentsController");
const verifyJWT = require("../utils/verifyJWT");

router.route("/createComment").post(verifyJWT, commentController.createComment);
router.route("/getComments/:postId").get(commentController.getComments);
router
  .route("/likeComment/:commentId")
  .put(verifyJWT, commentController.likeComment);

router
  .route("/editComment/:commentId")
  .put(verifyJWT, commentController.editComment);

router
  .route("/deleteComment/:commentId")
  .delete(verifyJWT, commentController.deleteComment);

router
  .route("/getAllComments")
  .get(verifyJWT, commentController.getAllComments);

module.exports = router;
