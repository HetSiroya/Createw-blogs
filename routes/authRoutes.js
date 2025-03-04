const express = require('express');
const router = express.Router();
const { signUp, verify, login, getusers, updateProfile, forgotPassword, verifyResetOtp, changePassword } = require('../controllers/authController');
const upload = require('../middleware/fileupload');
const { security } = require('../middleware/token-decode');





router.post('/regsitration', verify)
router.post('/signup', upload.single("userphoto"), signUp)
router.post('/login', login)
router.get('/getuser', security, getusers)
router.patch('/updateprofile', security, upload.single("userphoto"), updateProfile)
router.post('/forget-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.patch('/change-password', security, changePassword);


module.exports = router;