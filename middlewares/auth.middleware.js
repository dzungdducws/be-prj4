const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const User = require("../models/user/userModel");
const _const = require("../const/const");

const authToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    const [bearer, _token] = req.headers.authorization.split(' ');
    token = _token;
  } 

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  } else {
    try {
      const decoded = jwt.verify(token, _const.JWT_SECRET);
      req.curAccount = await User.findById(decoded.account_id).select(
        "-password"
      );
      next(); // next để gọi tiếp hàm sau
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
        data: token,
      });
    }
  }
});

module.exports = authToken;
