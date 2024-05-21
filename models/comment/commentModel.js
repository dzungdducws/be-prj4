const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentby: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users",
  },
  mention: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users",
  },
  comment: { type: String, required: false },
  likes: [
    {
      likeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "likes",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
