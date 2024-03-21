const Users = require("../models/User");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  //select does not return the password
  //lean will let mongoose give us data json
  const users = await Users.find().select("-password").lean();

  if (!users?.length) return res.status(400).json({ message: "No Users" });

  res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const duplicateUsername = await Users.findOne({ username });
  const duplicateEmail = await Users.findOne({ email });

  if (duplicateUsername || duplicateEmail)
    return res.status(409).json({ message: "Duplicate Username or Email" });

  const hashedPass = await bcrypt.hash(password, 10);

  const userObj = { username, email, password: hashedPass };

  const user = await Users.create(userObj);

  if (user) {
    res.status(201).json({ message: "Register Successfull" });
  } else {
    res.status(400).json({ message: "Invalid User Data" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, email, profilePicture } = req.body;

  //   if (req.user.id !== req.params.userId)
  //     return res
  //       .status(403)
  //       .json({ message: "You are no allowed to update this user" });

  if (req.body.password) {
    if (req.body.password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must atlesst 6 charactes" });
  }

  if (username) {
    if (username.length < 3 || username > 20)
      return res
        .status(400)
        .json({ message: "Username must be between 3 and 20 characters long" });

    if (username.includes(" "))
      return res.status(400).json({ message: "username cannot include space" });

    if (username.match(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/))
      return res
        .status(400)
        .json({ message: "Username must be letters and numbers only" });
  }

  const updatedUser = await Users.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        username,
        email,
        profilePicture,
        password: req.body.password,
      },
    },
    { new: true }
  );
  const { password, ...rest } = updatedUser._doc;
  res
    .status(200)
    .json({ ...rest, message: `${rest.username} successfully updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.userId;

  //find user
  const user = await Users.findById(id);

  if (!user) {
    return res.status(400).json({ message: `No User Found` });
  }

  const result = await user.deleteOne();

  const reply = `Username ${user.username} with ID ${user._id} is deleted`;

  res.json(reply);
});

const signOut = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("access_token")
    .json({ message: "User has been signed out" });
});

module.exports = { getAllUsers, createUser, updateUser, deleteUser, signOut };
