<<<<<<< HEAD
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Ready State:", mongoose.connection.readyState);
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", conn.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
=======
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
>>>>>>> 7d52a8b1d71d4059e80c43015346320a9d5672e0
