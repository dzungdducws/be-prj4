const express = require("express");
const comment = express.Router();
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

const Comment = require("../../models/comment/commentModel");
// const Like = require("../models/like/likeModel");
const Post = require("../../models/post/postModel");
const User = require("../../models/user/userModel");
const { ObjectId } = require("mongodb");

// const listUser = require("./users");
// let firstPosts = require("./first_post");
// let firstCmts = require("./first_cmt");

comment.getCmt = expressAsyncHandler(async (req, res) => {
  const { idCmt } = req.body;
  if (!mongoose.Types.ObjectId.isValid(idCmt)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }
  let cmt = await Comment.findById(idCmt);
  // console.log( cmt.data.commentby)
  let cmtCommentBt = cmt.commentby;
  let userName = await User.findById(cmtCommentBt).select("username -_id");
  // let
  let _res = {
    _id: cmt._id,
    commentby: userName.username,
    mention: cmt.mention,
    comment: cmt.comment,
    likes: cmt.likes,
    createdAt: cmt.createdAt,
    __v: cmt.__v,
  };

  res.status(200).json({
    message: "Thành công",
    data: _res,
  });
});

comment.addCmt = expressAsyncHandler(async (req, res) => {
  const { idPost, comment } = req.body;
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
    commentby: userName.id,
    comment: comment,
    likes: [],
    createdAt: new Date(),
  };

  // await Comment.insertOne(_res);
  await Comment.insertMany(_res);

  let post = await Post.findById(idPost);
  post.comments.push({
    commentId: newId._id,
  });

  await post.save();

  res.status(200).json({
    message: "Thành công",
    data: _res,
  });
});

module.exports = comment;
