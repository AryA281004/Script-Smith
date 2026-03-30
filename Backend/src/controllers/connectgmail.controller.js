const userModel = require('../models/user.model');
const { sendConnectEmailOtp } = require('../services/email.service');
const { sendConnectSuccessfully } = require('../services/email.service');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { client } = require('../db/redis');




// =========================
// CONNECT GMAIL (SEND OTP)
// =========================
const connectGmail = async (req, res) => {
    const userId = req.userId?.toString();
    let { email } = req.body;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (typeof email === 'object') email = email.email;

        email = email.trim().toLowerCase();

        // ❌ Check duplicate
        const existingUser = await userModel.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({
                message: 'This email is already used by another account'
            });
        }

        // 🔐 Secure OTP
        const otp = crypto.randomInt(100000, 1000000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // 💾 Store in Redis (10 min)
        await client.set(`gmail_otp:${userId}`, hashedOtp, { EX: 600 });
        await client.set(`gmail_email:${userId}`, email, { EX: 600 });

        await sendConnectEmailOtp(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('❌ connectGmail error:', error);

        // cleanup just in case
        if (userId) {
            await client.del(`gmail_otp:${userId}`);
            await client.del(`gmail_email:${userId}`);
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// =========================
// VERIFY OTP
// =========================
const verifyGmail = async (req, res) => {
    const userId = req.userId?.toString();
    const { otp } = req.body;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!otp) {
            return res.status(400).json({
                message: 'OTP is required'
            });
        }

        // 🔍 Get data from Redis
        const storedOtp = await client.get(`gmail_otp:${userId}`);
        const email = await client.get(`gmail_email:${userId}`);

        if (!storedOtp || !email) {
            return res.status(400).json({
                message: 'OTP expired or not found'
            });
        }

        // 🔐 Compare OTP
        const isOtpValid = await bcrypt.compare(otp, storedOtp);

        if (!isOtpValid) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        // ❌ Double check email
        const taken = await userModel.findOne({ email });
        if (taken && taken._id.toString() !== userId) {
            await client.del(`gmail_otp:${userId}`);
            await client.del(`gmail_email:${userId}`);

            return res.status(400).json({
                message: 'Email is already taken'
            });
        }

        // ✅ Update user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.email = email;

        if (!user.isGoogle) {
            user.gmailConnected = true;
        }

        await user.save();

        // 🧹 Cleanup
        await client.del(`gmail_otp:${userId}`);
        await client.del(`gmail_email:${userId}`);

        try{
            await sendConnectSuccessfully(user.email);
        }catch(err){
            console.error('Failed to send connection success email:', err);
        }

        return res.status(200).json({
            success: true,
            message: 'Email updated successfully'
        });

    } catch (error) {
        console.error('❌ verifyGmail error:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

module.exports = {
    connectGmail,
    verifyGmail
};