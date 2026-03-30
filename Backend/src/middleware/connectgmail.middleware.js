const userModel = require('../models/user.model');

const connectGmailMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if user has Gmail connected or signed up with Google
        const gmailConnected = user.isGoogle || user.gmailConnected;
        if (!gmailConnected) {
            return res.status(403).json({ message: 'Gmail account not connected. Please connect gmail for download structured notes, reset password, getting important mails and offers or to get credits with minimal price' });
        }
        next();
    } catch (error) {
        console.error('Error in connectGmailMiddleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = connectGmailMiddleware;