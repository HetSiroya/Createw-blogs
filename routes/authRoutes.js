const express = require('express');
const router = express.Router();
const { signUp, verify, login } = require('../controllers/authController');
const upload = require('../middleware/fileupload');





router.post('/regsitration', verify)
router.post('/signup', upload.single("userphoto"), signUp)
router.post('/login', login)

module.exports = router;