const express = require('express');
const { likeBlog, dislike } = require('../controllers/likeController');
const { security } = require('../middleware/token-decode');
const router = express.Router();

router.post('/post', security, likeBlog)
router.delete('/delete', security, dislike)


module.exports = router;