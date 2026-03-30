const userModel = require('../models/user.model');
const { sendOTPEmail } = require('../services/email.service');
const { client } = require('../db/redis');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendPasswordResetSuccessfully } = require('../services/email.service');


// In-memory store for Gmail verification OTPs: { email: { otp, userId, expiresAt } }


const changeName = async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

    try {
        // include password (select is false by default in schema)
        const user = await userModel.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        await user.save();
        res.status(200).json({ message: 'Name updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Basic input validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both currentPassword and newPassword are required' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    try {
        // include password (select is false by default in schema)
        const user = await userModel.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the account was created via Google OAuth it may not have a local password
        if (user.isGoogle) {
            return res.status(400).json({ success: false, message: 'Password change is not available for Google OAuth accounts' });
        }
        // Debug logs to help trace incorrect-current-password issues (do not log raw passwords)
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        try {
            await sendPasswordResetSuccessfully(user.email);
        } catch (mailError) {
            console.error('Password reset success email failed (changePassword):', mailError);
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error in changePassword:', error && error.stack ? error.stack : error);
        return res.status(500).json({ success: false, message: error?.message || 'Server error' });
    }
};

const otpForForgotPassword = async (req, res) => {
    let { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (typeof email === "object") {
            email = email.email;
        }

        email = email.trim().toLowerCase();

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isGoogle && !user.gmailConnected) {
            return res.status(403).json({
                message: "Gmail OTP only for Google/Gmail-connected users"
            });
        }

        // 🔐 Secure OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 🔐 Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // 💾 Store OTP (10 min expiry)
        await client.set(`fp_otp:${email}`, hashedOtp, { EX: 600 });

        // Store verification flag
        await client.set(`fp_verified:${email}`, "false", { EX: 600 });

        await sendOTPEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("❌ SEND OTP ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const verifyForgotPasswordOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || otp === undefined || otp === null) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedOtp = String(otp).replace(/\D/g, "").trim();

        if (normalizedOtp.length !== 6) {
            return res.status(400).json({
                message: "OTP must be 6 digits"
            });
        }

        const storedOtp = await client.get(`fp_otp:${normalizedEmail}`);

        if (!storedOtp) {
            return res.status(400).json({
                message: "OTP expired or not found"
            });
        }

        // 🔐 Compare OTP (supports bcrypt-hashed and legacy plain OTP values)
        let isMatch = false;
        const isBcryptHash = typeof storedOtp === "string" && /^\$2[aby]\$/.test(storedOtp);

        if (isBcryptHash) {
            isMatch = await bcrypt.compare(normalizedOtp, storedOtp);
        } else {
            isMatch = normalizedOtp === String(storedOtp).replace(/\D/g, "").trim();
        }

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // ✅ Mark verified
        await client.set(`fp_verified:${normalizedEmail}`, "true", {
            EX: 600
        });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("❌ VERIFY ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const resetPasswordAfterOTP = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }

        if (typeof newPassword !== "string" || newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // ✅ Check verification
        const isVerified = await client.get(`fp_verified:${normalizedEmail}`);

        if (isVerified !== "true") {
            return res.status(400).json({
                message: "OTP not verified"
            });
        }

        const user = await userModel.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Set new password (pre-save hook will hash it). Avoid double-hashing.
        user.password = newPassword;
        await user.save();

        // 🧹 Cleanup
        await client.del(`fp_otp:${normalizedEmail}`);
        await client.del(`fp_verified:${normalizedEmail}`);

        try {
            await sendPasswordResetSuccessfully(normalizedEmail);
        } catch (mailError) {
            console.error('Password reset success email failed (forgot password flow):', mailError);
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
        

    } catch (error) {
        console.error("❌ RESET ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteAccount = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    changeName,
    changePassword,
    otpForForgotPassword,
    verifyForgotPasswordOTP,
    resetPasswordAfterOTP,
    deleteAccount,
    
};