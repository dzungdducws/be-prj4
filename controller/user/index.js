const express = require("express");
const router = express.Router();
const userFunc = require("./user.controller");
const auth = require("../../middlewares/auth.middleware");

// router.post('/current', post.getUsers);
// router.get('/:userId', post.getUserDetails);
router.post("/login", userFunc.login);
router.post("/signup", userFunc.signup);
router.post("/getUser", auth, userFunc.getUser);
router.post("/getUserByUsername", auth, userFunc.getUserByUsername);
router.post("/getlistFollower", auth, userFunc.getlistFollower);
router.post("/getListFollowerBy", auth, userFunc.getListFollowerBy);
router.post("/setFollow", auth, userFunc.setFollow);
router.post("/delFollows", auth, userFunc.delFollows);
router.post("/delFollowedby", auth, userFunc.delFollowedby)

module.exports = router;
