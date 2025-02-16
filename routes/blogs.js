const express = require('express');
const blogModel = require('../Models/blogModel');
const { postblog, getblogs, editblog, deleteblog } = require('../controllers/blogsController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');
const router = express.Router();

router.post('/posts', upload.single("blog"), security, postblog)
router.get('/get', getblogs);
router.patch('/editdata', security, editblog)
router.delete('/delete', security, deleteblog)

module.exports = router;