const express = require('express');
const router = express.Router();
const { signUp, verify, login, getusers } = require('../controllers/authController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');





router.post('/regsitration', verify)
router.post('/signup', upload.single("userphoto"), signUp)
router.post('/login', login)
router.get('/getuser', security, getusers)

module.exports = router;