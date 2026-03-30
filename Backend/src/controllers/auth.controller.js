const userModel = require("../models/user.model");
const { getToken } = require("../utils/token");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = new userModel({ 
            name,
            email, 
            password 
        });
        await newUser.save();

        const token = await getToken(newUser._id);

        
       res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "none",    
  maxAge: 7 * 24 * 60 * 60 * 1000
});

        

        return res.status(201).json({ 
            message: "User registered successfully", 
            httpOnly: true,
            secure: true,
            user: newUser, 
            token 
        });
    } catch (error) {
        console.error("Error registering user:", error);
        
        const msg = error.message || "Internal server error";
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: msg, errors: error.errors });
        }
        res.status(500).json({ message: msg });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { email ,name } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        let user = await userModel.findOne({email});
        if(!user){  
            user = await userModel.create({email , name:name || email.split('@')[0], isGoogle:true});
        }

        let token = await getToken(user._id)
        
        res.cookie("token", token, {
  httpOnly: true,
  secure: true,       
  sameSite: "none",    
  maxAge: 7 * 24 * 60 * 60 * 1000
});

        return res.status(200).json({
            message:"User Registered Successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                isGoogle:user.isGoogle,
                gmailConnected: user.isGoogle || user.gmailConnected,
                credits:user.credits
            },
            token
        })

    }
    catch(error){
        console.error("Error in Google authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    // Implement login logic here
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = await getToken(user._id);

        
        res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "none",    
  maxAge: 7 * 24 * 60 * 60 * 1000
});

        const userSafe = user.toObject ? user.toObject() : user;
        if (userSafe.password) delete userSafe.password;

        return res.status(200).json({
            message: "Login successful",
            user: userSafe,
            token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

const logoutUser = async (req, res) => {
    try {
        // Clear cookie with the same options used when setting it
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, googleAuth, loginUser, logoutUser };