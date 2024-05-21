const express = require('express');
const router = express.Router();
const postFunc = require('./post.controller');
const auth = require("../../middlewares/auth.middleware");


// router.get('/all', post.getPosts);
// router.post('/like', post.likePost);
router.post('/getListPost',auth, postFunc.getListPost);

module.exports = router;