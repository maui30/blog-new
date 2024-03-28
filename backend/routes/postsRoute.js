const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const verifyJWT = require("../utils/verifyJWT");

router.route("/").post(verifyJWT, postController.createPost);

router.route("/getPosts").get(postController.getPosts);

router
  .route("/deletePost/:userId/:postId")
  .delete(verifyJWT, postController.deletePost);
module.exports = router;
