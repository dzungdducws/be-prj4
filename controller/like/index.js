const express = require("express");
const router = express.Router();
const likeFunc = require("./like.controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/getLike", auth, likeFunc.getLike);
// router.post('/delete', comment.deleteComment);
router.post("/like", auth, likeFunc.like);
router.post("/disLike", auth, likeFunc.disLike);

module.exports = router;
