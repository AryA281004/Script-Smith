const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');


router.post('/register-manually', authController.registerUser);
router.post('/register-google', authController.googleAuth);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);


module.exports = router;