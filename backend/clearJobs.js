// clearJobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const deleteJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Job.deleteMany({});
    console.log("🧹 All jobs deleted successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

deleteJobs();
