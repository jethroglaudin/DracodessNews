const express = require('express');
const router = express.Router();
const bcyrpt = require('bcryptjs');
const mongoose = require('mongoose');
const { User, validateUser } = require("../Models/User");


// @route GET api/users/test
// @desc: Test Get route
// @access Public
router.get('/test', (req, res) => res.send('Hello World!'));


// @route POST api/users/register
// @desc Register User
// @access Public
router.post("/register", async (req, res) => {
    const { error } = validateUser(req.body);
    const { name, userName, email, password, password2, avatar  } = req.body;
    if (error)
    return res.status(400).send(error.details[0].message);

    let checkEmail = await User.findOne({ email });
    let checkUserName = await User.findOne({ userName });
    let checkPassword = await User.findOne({ password });
    if(checkEmail) res.status(400).send("Email already exists.");
    if(checkUserName) res.status(400).send("Username already exists.");
    if(checkPassword) res.status(400).send("Password already exists.");
    if(password !== password2) res.status(400).send("Password does not match");

     let user = new User({
         name: name,
         userName: userName,
         email: email,
         password: password,
         avatar: avatar
     });

     const salt = await bcyrpt.genSalt(12);
     user.password = await bcyrpt.hash(user.password, salt);
     await user.save();
     res.send(user.toJSON());
});

// @route GET api/users/login
// @desc Login User
// @access Public

router.get("/login", async (req, res) => {
    res.send("login")
})



module.exports = router;