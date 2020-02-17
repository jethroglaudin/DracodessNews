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
      .populate("user", ["name", "userName", "email"])
      .sort({ date: 1 });
    res.json(allPost);
  } catch (error) {
    res.status(404).json({ NoPostfound: "No Post Found" });
  }
});

// @route POST api/post/newpost
// @desc Create Post
// @access private
router.post("/post", authenticate, async (req, res) => {
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
// @desc GET A Post
// @access private
router.get("/:id", authenticate, async (req, res) => {
  await Post.findOne({ _id: req.params.id })
    .populate("user", ["name", "userName", "email"])
    .exec((err, post) => {
      if (err) console.log(err);
      //   console.log(post);
      res.json(post);
    });
});

// @route POST api/post/like/:id
// @desc Like post
// @access private
router.post("/like/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ user: req.body._id });
    console.log(req.user);
    if (user) {
      const comment = await Post.findById(req.params.id);
      if (
        comment.likes.filter(like => like.user.toString() === req.user._id)
          .length > 0
      ) {
        return res.status(400).json({ error: "User has already liked post" });
      }
      if (
        comment.unlikes.filter(
          unlike => unlike.user.toString() === req.user._id
        )
      ) {
        const removeIndex = comment.unlikes
          .map(elem => elem.user.toString())
          .indexOf(req.user._id);
        comment.unlikes.splice(removeIndex, 1);
      }
      comment.likes.unshift({ user: req.user._id });
      await comment.save();
      res.json(comment);
    }
  } catch (error) {
    res.status(404).json({ error: "No Post Found" });
  }
  // redirect home page
});

// @route POST api/post/like/:id
// @desc Like post
// @access private
router.post("/unlike/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ user: req.body._id });
    console.log(req.user);
    if (user) {
      const comment = await Post.findById(req.params.id);
      if (
        comment.unlikes.filter(
          unlike => unlike.user.toString() === req.user._id
        ).length > 0
      ) {
        return res.status(400).json({ error: "User has already unliked post" });
      }
      if (comment.likes.filter(like => like.user.toString() === req.user._id)) {
        const removeIndex = comment.likes
          .map(elem => elem.user.toString())
          .indexOf(req.user._id);
        comment.likes.splice(removeIndex, 1);
      }
      comment.unlikes.unshift({ user: req.user._id });
      await comment.save();
      res.json(comment);
    }
  } catch (error) {
    res.status(404).json({ error: "No Post Found" });
  }
  // redirect home page
});

module.exports = router;
