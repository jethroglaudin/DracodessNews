const express = require("express");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
const { Post, validatePost, validateComment } = require("../Models/Post");
const { User } = require("../Models/User");

// @route GET api/post/test
// @desc test post route and authentication
// @access private
router.get("/test", authenticate, async (req, res) => {
  res.send("Authentication works");
});

// @route GET api/post/
// @desc GET Posts
// @access public
router.get("/posts", async (req, res) => {
  try {
    const allPost = await Post.find()
    .populate('user', ["name", "userName", "email"])
    .sort({ date: 1 });
      res.json(allPost);
  } catch (error) {
      res.status(404).json({ NoPostfound: "No Post Found" });
  }
});

// @route POST api/post/newpost
// @desc Create Post
// @access private
router.post("/post", async (req, res) => {
  const { user, title, summary, url } = req.body;
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  let newPost = new Post({
    user,
    title,
    summary,
    url
  });

  newPost = await newPost.save();
  res.send(newPost);
});

// @route GET api/post/newpost
// @desc Create Post
// @access private
router.get("/:id", async (req, res) => {  
   await Post.findOne({ _id: req.params.id })
   .populate('user', [ "name", "userName", "email" ])
   .exec((err, post) => {
       if (err) console.log(err);
       console.log(post);
       res.json(post);
   })
   
//    console.log(userPost);
})

module.exports = router;
