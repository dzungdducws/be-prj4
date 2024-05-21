const express = require("express");
const importDataRouter = express.Router();
const expressAsyncHandler = require("express-async-handler");

const Comment = require("../models/comment/commentModel");
const Like = require("../models/like/likeModel");
const Post = require("../models/post/postModel");
const User = require("../models/user/userModel");

const listUser = require("./users");
let firstPosts = require("./first_post");
let firstCmts = require("./first_cmt");

importDataRouter.post(
  "/removeAll",
  expressAsyncHandler(async (req, res) => {
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    res.status(200).send("Remove all successful");
  })
);

importDataRouter.post(
  "/addUser",
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUsers = await User.insertMany(listUser);
    res.status(200).send(importUsers);
  })
);

importDataRouter.post(
  "/addFollow",
  expressAsyncHandler(async (req, res) => {
    let listUser = await User.find({});
    listUser.forEach(async (user) => {
      let listIdUser = await User.find({}).select("_id");

      let _user = await User.findById(user.id);
      let r = Math.floor(Math.random() * 3);
      for (let i = 0; i < r; i++) {
        let _id = listIdUser[Math.floor(Math.random() * listIdUser.length)].id;
        if (_id != user.id) {
          _user.followedby.push({
            userid: _id,
          });
          let __user = await User.findById(_id);
          __user.follows.push({
            userid: user.id,
          });
          await __user.save();
        }
      }
      await _user.save();
    });
    res.status(200).send(listUser);
  })
);

importDataRouter.post(
  "/addLike",
  expressAsyncHandler(async (req, res) => {
    await Like.deleteMany({});
    let listIdUser = await User.find({}).select("_id");

    let listLike = [];
    let maxLikeLength = firstPosts.length + firstCmts.length;

    let listLikeLength = Math.floor(Math.random() * maxLikeLength);

    for (let i = 0; i < listLikeLength; i++) {
      listLike.push({
        likeby: listIdUser[Math.floor(Math.random() * listIdUser.length)].id,
      });
    }

    const importLikes = await Like.insertMany(listLike);
    res.status(200).send(importLikes);
  })
);

importDataRouter.post(
  "/addCmt",
  expressAsyncHandler(async (req, res) => {
    await Post.deleteMany({});
    let listIdUser = await User.find({}).select("_id");
    let listIdLike = await Like.find({}).select("_id");

    let _cmt = firstCmts;

    _cmt.map((cmt) => {
      cmt.commentby =
        listIdUser[Math.floor(Math.random() * listIdUser.length)].id;
      let r = Math.floor(Math.random() * 2);
      for (let i = 0; i < r; i++)
        if (listIdLike.length > 0) {
          cmt.likes.push({ likeId: listIdLike.pop().id });
        }
    });
    const updateCmt = await Comment.insertMany(_cmt);

    res.status(200).send(updateCmt);
  })
);

importDataRouter.post(
  "/addInformationForPost",
  expressAsyncHandler(async (req, res) => {
    await Post.deleteMany({});
    let listIdUser = await User.find({}).select("_id");
    let listIdLike = await Like.find({}).select("_id");
    let listIdCmt = await Comment.find({}).select("_id");

    firstPosts.map((post) => {
      post.postby =
        listIdUser[Math.floor(Math.random() * listIdUser.length)].id;
      let r_for_like = Math.floor(Math.random() * 5);

      for (let i = 0; i < r_for_like; i++)
        if (listIdLike.length > 0) {
          post.likes.push({ likeId: listIdLike.pop().id });
        }

      let r_for_cmt = Math.floor(Math.random() * 5);
      for (let i = 0; i < r_for_cmt; i++)
        if (listIdCmt.length > 0) {
          post.comments.push({ commentId: listIdCmt.pop().id });
        }
    });

    const updatePost = await Post.insertMany(firstPosts);
    res.status(200).send(updatePost);
  })
);

importDataRouter.post(
  "/test",
  expressAsyncHandler(async (req, res) => {
    let _cmt = firstCmts;
    res.status(200).send(_cmt);
  })
);

module.exports = importDataRouter;

//addUser->addLike->addCmt->>addInfo
