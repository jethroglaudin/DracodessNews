const express = require("express");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
const { Post, validatePost, validateComment } = require("../Models/Post");
const { User } = require("../Models/User");

// @route GET api/post/
// @desc test post route and authentication
// @access private
router.get("/test", authenticate, async (req, res) => {
  res.render('index');
  // res.send("Authentication works");
});

router.get("/create", async (req, res) => {
  res.render('posts/create', {  
    title: "",
    url: "",
    summary: ""
});
  // res.send("Authentication works");
});

// @route GET api/post/
// @desc GET Posts
// @access public
router.get("/posts", async (req, res) => {
  try {
    const allPost = await Post.find()
      .populate("user", ["name", "userName", "email"])
      .sort({ date: 1 });
    // res.json(allPost);
    res.render("posts/public", { data: allPost })
    
  } catch (error) {
    res.status(404).json({ NoPostfound: "No Post Found" });
  }
});

// @route POST api/post/create
// @desc Create Post
// @access private
router.post("/create", async (req, res) => {
  const { title, summary, url } = req.body;
  const { error } = validatePost(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let newPost = new Post({
    title,
    summary,
    url
  });
  newPost = await newPost.save();
  // res.send(newPost);
  res.redirect("/api/post/")
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
      const post = await Post.findById(req.params.id);
      if (
        post.likes.filter(like => like.user.toString() === req.user._id)
          .length > 0
      ) {
        return res.status(400).json({ error: "User has already liked post" });
      }
      if (
        post.unlikes.filter(unlike => unlike.user.toString() === req.user._id)
      ) {
        const removeIndex = post.unlikes
          .map(elem => elem.user.toString())
          .indexOf(req.user._id);
        post.unlikes.splice(removeIndex, 1);
      }
      post.likes.unshift({ user: req.user._id });
      await post.save();
      res.json(post);
    }
  } catch (error) {
    res.status(404).json({ error: "No Post Found" });
  }
  // redirect home page
});

// @route POST api/post/unlike/:id
// @desc Unlike post
// @access private
router.post("/unlike/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ user: req.body._id });
    console.log(req.user);
    if (user) {
      const post = await Post.findById(req.params.id);
      if (
        post.unlikes.filter(unlike => unlike.user.toString() === req.user._id)
          .length > 0
      ) {
        return res.status(400).json({ error: "User has already unliked post" });
      }
      if (post.likes.filter(like => like.user.toString() === req.user._id)) {
        const removeIndex = post.likes
          .map(elem => elem.user.toString())
          .indexOf(req.user._id);
        post.likes.splice(removeIndex, 1);
      }
      post.unlikes.unshift({ user: req.user._id });
      await post.save();
      res.json(post);
    }
  } catch (error) {
    res.status(404).json({ error: "No Post Found" });
  }
  // redirect home page
});

// @route POST api/post/comment/:id
// @desc Add Comment
// @access private
router.post("/comment/:id", authenticate, async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    const { text } = req.body;

    if (error) return res.status(400).send(error.details[0].message);

    const post = await Post.findById(req.params.id);
    const newComment = { text };
    post.comments.unshift(newComment);
    post.comments.populate("commentor");
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "No Post Found" });
  }
});

module.exports = router;
