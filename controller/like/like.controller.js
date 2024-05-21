const express = require("express");
const likeRouter = express.Router();
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

const Like = require("../../models/like/likeModel");
const Post = require("../../models/post/postModel");
const User = require("../../models/user/userModel");

// const listUser = require("./users");
// let firstPosts = require("./first_post");
// let firstCmts = require("./first_cmt");

likeRouter.getLike = expressAsyncHandler(async (req, res) => {
  const { idLike } = req.body;
  if (!mongoose.Types.ObjectId.isValid(idLike)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }
  let listLike = await Like.findById(idLike);

  res.status(200).json({
    message: "Thành công",
    data: listLike,
  });
});

likeRouter.like = expressAsyncHandler(async (req, res) => {
  const { idPost } = req.body;
  const userId = req.curAccount._id;
  if (!mongoose.Types.ObjectId.isValid(idPost)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  let userName = await User.findById(userId).select("username");
  // let
  let newId = new ObjectId();
  let _res = {
    _id: newId,
    likeby: userName.id,
    createdAt: new Date(),
  };

  // await Comment.insertOne(_res);
  await Like.insertMany(_res);
  let post = await Post.findById(idPost);
  post.likes.push({
    likeId: newId._id,
  });

  await post.save();

  res.status(200).json({
    message: "Thành công",
  });
});

likeRouter.disLike = expressAsyncHandler(async (req, res) => {
  const { idPost } = req.body;
  const userId = req.curAccount._id;
  if (!mongoose.Types.ObjectId.isValid(idPost)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  let userName = await User.findById(userId).select("username");

  // await Comment.insertOne(_res);
  // await Comment.insertMany(_res);

  let post = await Post.findById(idPost);
  post.likes = post.likes.filter((like) => {
    console.log(like.likeby + ", " + userId);
    return like.likeby != userId;
  });

  await post.save();

  res.status(200).json({
    message: "Thành công",
  });
});

module.exports = likeRouter;
