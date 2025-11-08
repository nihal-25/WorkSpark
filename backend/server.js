//flow : models-->routes-->server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";
import SavedJobsRoutes from "./routes/SavedJobsRoutes.js";

import { fileURLToPath } from "url";



dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",           // local dev (Vite)
      "https://workspark.vercel.app",    // ✅ your deployed frontend (replace with exact URL)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications",applicationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/savedJobs",SavedJobsRoutes)
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
