const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentsController");
const verifyJWT = require("../utils/verifyJWT");

router.route("/createComment").post(verifyJWT, commentController.createComment);

module.exports = router;
