//flow : models-->routes-->server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";
import SavedJobsRoutes from "./routes/SavedJobsRoutes.js";
dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications",applicationRoutes);
app.use("/savedJobs",SavedJobsRoutes)
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
