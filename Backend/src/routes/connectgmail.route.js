const express = require('express');
const router = express.Router();
const connectGmailController = require('../controllers/connectgmail.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/connect-gmail', authMiddleware, connectGmailController.connectGmail);
router.post('/verify-gmail', authMiddleware, connectGmailController.verifyGmail);

module.exports = router;