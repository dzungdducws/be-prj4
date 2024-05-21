// instagramModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: { type: String, required: false },
  username: { type: String, required: false },
  email: { type: String, required: false },
  token: {
    type: String,
    require: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Non-binary"],
    required: false,
  },
  country: { type: String, required: false },
  profilephoto: { type: String, required: false },
  followedby: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "users",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  follows: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "users",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  storydate: { type: Date, required: false },
  bio: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
