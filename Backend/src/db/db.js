const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
  dbName: "ScriptSmith"
})
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.warn('Proceeding without MongoDB connection. Some features may be unavailable.');
       
    }

};

module.exports = connectDB;





