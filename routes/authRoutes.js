const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/authController');
const upload = require('../middleware/fileupload');






router.post('/signup', upload.single("userphoto"), signUp)

module.exports = router;