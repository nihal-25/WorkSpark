import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Applications.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/** GET /jobs  -> list all jobs */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/** GET /jobs/my-jobs -> recruiter’s jobs with applicants */
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view their jobs" });
    }

    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

    // also fetch applicants for each job
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await Application.find({ job: job._id })
          .populate("jobseeker", "name email");
        return { ...job.toObject(), applicants };
      })
    );

    res.json(jobsWithApplicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** GET /jobs/:id -> single job */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Invalid job id" });
  }
});

/** POST /jobs -> create job (protected, recruiter only) */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id, // recruiter from JWT
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



export default router;
