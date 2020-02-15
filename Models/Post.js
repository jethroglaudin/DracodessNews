const mongoose = require("mongoose");
const Joi = require("joi");
const PostSchema = new mongoose.Schema({
  originalPoster: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
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
      }
    }
  ],
  date: {
    type: Data,
    default: Date.now
  }
});

const Post = mongoose.model('post', PostSchema);

function validatePost () {
    const postSchema = {

    }
}