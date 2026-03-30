const express = require("express");
const router = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware');
const connectGmailMiddleware = require('../middleware/connectgmail.middleware');
const { createCreditOrder } = require("../controllers/payment.controller");

router.post("/credit-order", authMiddleware, connectGmailMiddleware, createCreditOrder);

module.exports = router;