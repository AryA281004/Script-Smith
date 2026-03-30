const jwt = require("jsonwebtoken");

const getToken = async (userId) => {
    try{
        const token = jwt.sign(
            { userId: userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }

}

module.exports = { getToken };

