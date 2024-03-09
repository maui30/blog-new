const express = require("express");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All field are required" });

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Email does not exist" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(401).json({ message: "Password does not match" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );

  const { password: pass, ...rest } = user._doc;

  res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
});

module.exports = { signIn };
