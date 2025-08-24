// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Applications.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc   Get all applications for logged-in user
// @route  GET /applications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ jobseeker: req.user.id }).populate("job");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Apply for a job
// @route  POST /applications
// @desc   Apply for a job
// @route  POST /applications
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { job } = req.body; // job id comes from frontend

    if (!job) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if this jobseeker has already applied for this job
    const existing = await Application.findOne({
      job,
      jobseeker: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    const newApplication = await Application.create({
      job,
      jobseeker: req.user.id, // take from token, not frontend!
    });

    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
