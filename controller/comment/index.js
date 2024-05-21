const express = require('express');
const router = express.Router();
const comment = require('./comment.controller');
const auth = require("../../middlewares/auth.middleware");

router.post('/getCmt', auth, comment.getCmt);
router.post('/addCmt', auth, comment.addCmt)
// router.post('/like', comment.likeCommment);

module.exports = router;