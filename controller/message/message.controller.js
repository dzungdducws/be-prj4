const express = require("express");
const msgRouter = express.Router();
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

const Message = require("../../models/message/messageModel");

msgRouter.sendMsg = expressAsyncHandler(async (req, res) => {
  try {
    const from = req.curAccount._id;
    const { to, message } = req.body;
    const newMessage = new Message({
      from,
      to,
      message,
      timestamp: new Date(),
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the message." });
  }
});

msgRouter.getChatHistory = expressAsyncHandler(async (req, res) => {
  try {
    const { from, to } = req.body;
    console.log(from);
    const chatHistory = await Message.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from },
      ],
    });

    res.status(200).json(chatHistory);

  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the message." });
  }
});

module.exports = msgRouter;
