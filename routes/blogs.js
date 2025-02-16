const express = require('express');
const blogModel = require('../Models/blogModel');
const { postblog, getblogs } = require('../controllers/blogsController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');
const router = express.Router();

router.post('/posts', upload.single("blog"), security, postblog)
router.get('/get', getblogs);

module.exports = router;