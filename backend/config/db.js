const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds wait
      socketTimeoutMS: 45000,          // 45 seconds before timing out
    });
    console.log(`✅ MongoDB Connected! Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    // Removed process.exit(1) to keep server alive on Render
  }
};

module.exports = connectDB;
