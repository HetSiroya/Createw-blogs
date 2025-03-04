const express = require('express');
const blogModel = require('../Models/blogModel');
const { postblog, getblogs, editblog, deleteblog, getblogsuser, loginuserdetail } = require('../controllers/blogsController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');
const likeRoutes = require('./likeRoutes');
const router = express.Router();

router.post('/posts', upload.single("blog"), security, postblog)
router.get('/get', security, getblogs);
router.patch('/editdata', upload.single("blog"), security, editblog)
router.delete('/delete', security, deleteblog)
router.get('/getbloguser', security, getblogsuser)
router.get('/loginuser', security, loginuserdetail)


router.use('/like', likeRoutes)

module.exports = router;