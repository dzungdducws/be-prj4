const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: { type: String },
  to: String,
  message: String,
  timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
