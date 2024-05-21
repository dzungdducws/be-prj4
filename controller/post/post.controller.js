const express = require("express");
const postRouter = express.Router();
const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Comment = require("../../models/comment/commentModel");
const Like = require("../../models/like/likeModel");
const Post = require("../../models/post/postModel");
const User = require("../../models/user/userModel");

// const listUser = require("./users");
// let firstPosts = require("./first_post");
// let firstCmts = require("./first_cmt");

postRouter.getListPost = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const _userId = userId || req.curAccount._id;

  if (!mongoose.Types.ObjectId.isValid(_userId)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  try {
    const listPost = await Post.find({ postby: _userId });

    const _res = await Promise.all(
      listPost.map(async (post) => {
        const [userName, likes, comments] = await Promise.all([
          User.findById(post.postby).select("username -_id"),
          Promise.all(
            post.likes?.map(async (like) => {
              const trueLike = await Like.findById(like.likeId);
              const likeUser = await User.findById(trueLike.likeby).select(
                "username -_id"
              );
              return {
                _id: trueLike._id,
                likeby: likeUser.username,
                createdAt: trueLike.createdAt,
                __v: trueLike.__v,
              };
            })
          ),
          Promise.all(
            post.comments?.map(async (comment) => {
              const trueCmt = await Comment.findById(comment.commentId);
              const cmtUser = await User.findById(trueCmt.commentby).select(
                "username -_id"
              );
              return {
                _id: trueCmt._id,
                commentby: cmtUser.username,
                mention: trueCmt.mention,
                comment: trueCmt.comment,
                likes: trueCmt.likes,
                createdAt: trueCmt.createdAt,
                __v: trueCmt.__v,
              };
            })
          ),
        ]);

        return {
          _id: post._id,
          postby: userName.username,
          photo: post.photo,
          location: post.location,
          caption: post.caption,
          likes: likes,
          comments: comments,
          createdAt: post.createdAt,
          __v: post.__v,
        };
      })
    );

    res.status(200).json({
      message: "Thành công",
      data: _res,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// postRouter.

module.exports = postRouter;
