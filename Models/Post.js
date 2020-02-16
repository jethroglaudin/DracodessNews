const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  originalPoster: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 160
  },

  summary: {
    type: String,
    required: true,
    minLength: 30
  },
  url: {
    type: String,
    require: true
  },

  comments: [
    {
      commentor: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      userName: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
          type: Date,
          default: Date.now
      }
    },
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('post', PostSchema);

function validatePost (post) {
    const postSchema = {
        title: Joi.string().min(3).max(160).required(),
        summary: Joi.string().min(30).required(),
        url: Joi.string().required()
    }
    return Joi.validate(post, postSchema);
}

function validateComment (comment) {
    const commentSchema = {
        text: Joi.string().required()
    }
    return Joi.validate(comment, commentSchema);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.validateComment = validateComment;