const userModel = require("../models/user.model");
const { getToken } = require("../utils/token");

// 🔥 COMMON COOKIE OPTIONS (reuse everywhere)
const cookieOptions = {
  httpOnly: true,
  secure: true,          // ✅ required for HTTPS (Vercel)
  sameSite: "none",      // ✅ required for cross-origin
  path: "/",             // ✅ CRITICAL FIX (your missing piece)
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await userModel.create({ name, email, password });

    const token = await getToken(newUser._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GOOGLE AUTH =================
const googleAuth = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        name: name || email.split("@")[0],
        isGoogle: true
      });
    }

    const token = await getToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGoogle: user.isGoogle,
        gmailConnected: user.isGoogle || user.gmailConnected,
        credits: user.credits
      },
      token
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await getToken(user._id);

    res.cookie("token", token, cookieOptions);

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({
      message: "Login successful",
      user: userSafe,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGOUT =================
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  googleAuth,
  loginUser,
  logoutUser
};