const express = require('express');
const router = express.Router();
const { signUp, verify, login, getusers, updateProfile, forgotPassword, verifyResetOtp } = require('../controllers/authController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');





router.post('/regsitration', verify)
router.post('/signup', upload.single("userphoto"), signUp)
router.post('/login', login)
router.get('/getuser', security, getusers)
router.patch('/updateprofile', security, upload.single("userphoto"), updateProfile)
router.post('/forget-password', security, forgotPassword);
router.post('/verify-reset-otp', security, verifyResetOtp);


module.exports = router;