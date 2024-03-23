const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");
const verifyJWT = require("../utils/verifyJWT");

router
  .route("/")
  .get(verifyJWT, usersController.getAllUsers)
  .post(usersController.createUser);

router.route("/:userId").put(usersController.updateUser);
router.route("/delete/:userId").delete(usersController.deleteUser);

router.route("/signout").post(usersController.signOut);

module.exports = router;
