const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcyrpt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const { User, validateUser } = require("../Models/User");

// @route GET api/users/test
// @desc: Test Get route
// @access Public
router.get("/test", (req, res) => res.send("Hello World!"));

// @route POST api/users/register
// @desc Register User
// @access Public
router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  const { name, userName, email, password, password2, avatar } = req.body;
  if (error) return res.status(400).send(error.details[0].message);

  let checkEmail = await User.findOne({ email });
  let checkUserName = await User.findOne({ userName });
  let checkPassword = await User.findOne({ password });
  if (checkEmail) return res.status(400).send("Email already exists.");
  if (checkUserName) return res.status(400).send("Username already exists.");
  if (checkPassword) return res.status(400).send("Password already exists.");
  if (password !== password2) return res.status(400).send("Password does not match");

  const user = new User({
    name: name,
    userName: userName,
    email: email,
    password: password,
    avatar: avatar
  });
  const newUser = await user.save();
  res.json(newUser);
  

  //  const salt = await bcyrpt.genSalt(12);
  // const token = user.generateToken()
  // res.header("x-auth-token", token).send({ id: newUser._id, name: newUser.name, userName: newUser.userName });

  // will redirect to login template/html file
});

// @route GET api/users/login
// @desc Login User
// @access Public
router.get("/login", async (req, res) => {
  const { errors } = req.body;
  const { email, userName, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { userName }] });
  if (!user) return res.status(400).send("Invalid email/username or password", res.json(errors).details[0].message);

  const isValidPassword = await bcyrpt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).send("Invalid email or password", res.json(errors.details[0].message));
  console.log(isValidPassword);
  
  const token = user.generateToken();
  res.header('x-auth-token', token).send({ _id: user._id, name: user.name, userName: userName})
  // redirect to main page
  

});

module.exports = router;
