const express = require("express");
const userRouter = express.Router();
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// const Comment = require("../models/comment/commentModel");
// const Like = require("../models/like/likeModel");
// const Post = require("../models/post/postModel");
const User = require("../../models/user/userModel");
const _const = require("../../const/const");
// const listUser = require("./users");
// let firstPosts = require("./first_post");
// let firstCmts = require("./first_cmt");

userRouter.login = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Tham số không đủ",
    });
  }

  let account;

  let account_check_username = await User.findOne({
    username: username,
    password: password,
  });

  if (account_check_username == null) {
    let account_check_email = await User.findOne({
      email: username,
      password: password,
    });

    if (account_check_email == null)
      return res.status(401).json({
        message: "Username/email không tồn tại hoặc mật khẩu không đúng",
      });
    else account = account_check_email;
  } else {
    account = account_check_username;
  }

  let token = jwt.sign(
    {
      account_id: account._id,
    },
    _const.JWT_SECRET,
    { expiresIn: "30d" }
  );

  account.token = token;
  account.save();

  res.status(200).json({
    message: "Đăng nhập thành công",
    data: account,
  });
});

userRouter.signup = expressAsyncHandler(async (req, res) => {
  const { username, email, password, gender } = req.body;
  if (!username || !email || !password || !gender) {
    return res.status(400).json({
      message: "Tham số không đủ",
    });
  }
  const userExists = await User.findOne({
    username: username,
    email: email,
  });
  if (!userExists) {
    let account = await new User({
      username: username,
      email: email,
      password: password,
      gender: gender,
      profilephoto: "",
    }).save();

    let _account = await User.findOne({
      username: username,
      email: email,
      password: password,
    });

    let token = jwt.sign(
      {
        account_id: _account._id,
      },
      _const.JWT_SECRET,
      { expiresIn: "30d" }
    );

    account.token = token;
    account.save();

    return res.status(200).json({
      message: "Đăng ký thành công",
      data: account,
    });
  } else {
    return res.status(400).json({
      message: "Username/email đã tồn tại",
    });
  }
});

userRouter.getUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const _userId = userId ? userId : req.curAccount._id;
  if (!mongoose.Types.ObjectId.isValid(_userId)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }
  let user = await User.findById(_userId).select(
    "-password -token -createdAt -__v"
  );

  res.status(200).json({
    message: "Truy vấn thành công",
    data: user,
  });
});

userRouter.getUserByUsername = expressAsyncHandler(async (req, res) => {
  const {username} = req.body;
  let user = await User.findOne({username: username}).select(
    "-password -token -createdAt -__v"
  );

  res.status(200).json({
    message: "Truy vấn thành công",
    data: user,
  });
});

userRouter.getListFollowerBy = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const _userId = userId ? userId : req.curAccount._id;
  if (!mongoose.Types.ObjectId.isValid(_userId)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }
  let listFollowerBy = await User.findById(_userId).select("followedby -_id");

  res.status(200).json({
    message: "Truy vấn thành công",
    data: listFollowerBy,
  });
});

userRouter.getlistFollower = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const _userId = userId ? userId : req.curAccount._id;
  if (!mongoose.Types.ObjectId.isValid(_userId)) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }
  let listFollower = await User.findById(_userId).select("follows -_id");

  res.status(200).json({
    message: "Truy vấn thành công",
    data: listFollower,
  });
});

userRouter.setFollow = expressAsyncHandler(async (req, res) => {
  const { userFollowId } = req.body;
  const _userId = req.curAccount._id;
  if (
    !mongoose.Types.ObjectId.isValid(_userId) ||
    !mongoose.Types.ObjectId.isValid(userFollowId)
  ) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  if (_userId != userFollowId) {
    let _user = await User.findById(_userId);
    let __user = await User.findById(userFollowId);

    let check1 = false;
    let check2 = false;

    _user.follows.forEach((fl) => {
      if (fl.userid.valueOf() == userFollowId) {
        check1 = true;
      }
    });

    __user.followedby.forEach((fl) => {
      if (fl.userid.valueOf() == _userId) {
        check2 = true;
      }
    });

    if (check1 || check2) {
      return res.status(401).json({
        message: "Đã tồn tại",
      });
    } else {
      _user.follows.push({
        userid: userFollowId,
      });

      __user.followedby.push({
        userid: _userId,
      });
      console.log(123);
      await _user.save();
      await __user.save();
    }
  }
  res.status(200).json({
    message: "Thành công",
  });
});

userRouter.delFollowedby = expressAsyncHandler(async (req, res) => {
  const { _userId } = req.body;
  const userFollowId = req.curAccount._id;
  if (
    !mongoose.Types.ObjectId.isValid(_userId) ||
    !mongoose.Types.ObjectId.isValid(userFollowId)
  ) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  if (_userId != userFollowId) {
    let _user = await User.findById(_userId);
    let __user = await User.findById(userFollowId);

    let newUserFollows = [];
    let newUserFollowedby = [];

    _user.follows.forEach((fl) => {
      if (fl.userid.valueOf() != userFollowId) {
        newUserFollows.push(fl);
      }
    });

    __user.followedby.forEach((fl) => {
      if (fl.userid.valueOf() != _userId) {
        newUserFollowedby.push(fl);
      }
    });
    _user.follows = newUserFollows;
    __user.followedby = newUserFollowedby;
    await _user.save();
    await __user.save();
  }
  res.status(200).json({
    message: "Thành công",
  });
});

userRouter.delFollows = expressAsyncHandler(async (req, res) => {
  const { userFollowId } = req.body;
  const _userId = req.curAccount._id;
  if (
    !mongoose.Types.ObjectId.isValid(_userId) ||
    !mongoose.Types.ObjectId.isValid(userFollowId)
  ) {
    return res.status(401).json({
      message: "Id không hợp lệ",
    });
  }

  if (_userId != userFollowId) {
    let _user = await User.findById(_userId);
    let __user = await User.findById(userFollowId);

    let newUserFollows = [];
    let newUserFollowedby = [];

    _user.follows.forEach((fl) => {
      if (fl.userid.valueOf() != userFollowId) {
        newUserFollows.push(fl);
      }
    });

    __user.followedby.forEach((fl) => {
      if (fl.userid.valueOf() != _userId) {
        newUserFollowedby.push(fl);
      }
    });
    _user.follows = newUserFollows;
    __user.followedby = newUserFollowedby;
    await _user.save();
    await __user.save();
  }
  res.status(200).json({
    message: "Thành công",
  });
});

module.exports = userRouter;
