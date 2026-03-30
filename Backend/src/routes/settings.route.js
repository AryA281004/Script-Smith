const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.put('/change-name', authMiddleware, settingsController.changeName);
router.put('/change-password', authMiddleware, settingsController.changePassword); 
router.post('/otp-for-forgot-password', settingsController.otpForForgotPassword);
router.post('/verify-forgot-password-otp', settingsController.verifyForgotPasswordOTP);
router.post('/reset-password-after-otp', settingsController.resetPasswordAfterOTP);
router.delete('/delete-account', authMiddleware, settingsController.deleteAccount); 


module.exports = router;