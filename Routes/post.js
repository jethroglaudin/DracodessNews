const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const { Post, validatePost, validateComment} = require('../Models/Post');

router.get('/test', authenticate, async (req, res) => {
    res.send('Authentication works');
})


module.exports = router;