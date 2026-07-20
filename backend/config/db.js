import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Database features will not work.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Don't kill the whole server on a DB failure. Keep the process alive so
    // the health check responds and requests fail cleanly instead of the
    // instance crash-looping. Retry the connection shortly.
    console.error("❌ MongoDB connection failed:", err.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
