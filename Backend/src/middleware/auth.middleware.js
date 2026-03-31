const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    // ✅ Check token from BOTH cookies (same-domain) and Authorization header (cross-domain)
    let token = req.cookies.token;
    
    // If no cookie token, check Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7); // Remove "Bearer " prefix
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized : No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        const userId = decoded.userId || decoded.id;
        if (!decoded || !userId) {
            return res.status(401).json({ message: "Unauthorized : Invalid token" });
        }
        req.userId = userId;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized : Invalid token" });
    }
};

// Export the middleware function directly so it can be used as
// `const authMiddleware = require('../middleware/auth.middleware');`
module.exports = authMiddleware;
// Also provide a named export for files that destructure: `const { authMiddleware } = require(...)`
module.exports.authMiddleware = authMiddleware;
