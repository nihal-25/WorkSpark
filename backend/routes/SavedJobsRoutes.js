// routes/savedJobRoutes.js
import express from "express";
import SavedJob from "../models/SavedJobs.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc   Get all saved jobs for logged-in user
// @route  GET /saved-jobs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const saved = await SavedJob.find({ jobseeker: req.user.id }).populate("job");
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Save a job
// @route  POST /saved-jobs
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { job } = req.body;
    if (!job) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const saved = await SavedJob.create({
      job,
      jobseeker: req.user.id,
    });

    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Job already saved" });
    }
    res.status(400).json({ message: error.message });
  }
});

// @desc   Remove a saved job
// @route  DELETE /saved-jobs/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ job: req.params.id, jobseeker: req.user.id });
    res.json({ message: "Job removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
