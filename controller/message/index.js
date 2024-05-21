const express = require('express');
const router = express.Router();
const msgFunc = require('./message.controller');
const auth = require("../../middlewares/auth.middleware");

router.post('/sendMsg',auth, msgFunc.sendMsg);
router.post('/getChatHistory',auth, msgFunc.getChatHistory);
// router.post('/like', comment.likeCommment);

module.exports = router;