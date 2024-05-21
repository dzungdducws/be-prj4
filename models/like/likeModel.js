const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  likeby: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
