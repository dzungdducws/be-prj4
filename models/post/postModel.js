const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postby: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users",
  },
  photo: [
    {
      link: {
        type: String,
        required: false,
      },
    },
  ],
  location: { type: String, required: false },
  caption: { type: String, required: false },
  likes: [
    {
      likeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "likes",
      },
    },
  ],
  comments: [
    {
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "comments",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
