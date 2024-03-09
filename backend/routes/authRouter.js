const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.route("/signin").post(authController.signIn);

module.exports = router;
