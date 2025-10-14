import express from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";
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
          .populate("jobseeker", "name email experience skills resume");
        return { ...job.toObject(), applicants };
      })
    );

    res.json(jobsWithApplicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all "held" applicants for a recruiter's jobs
router.get("/held-applicants", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view this" });
    }

    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: req.user.id });

    // Get all applications with status = "hold" for those jobs
    const heldApplicants = await Application.find({
      job: { $in: jobs.map((j) => j._id) },
      status: "hold",
    })
      .populate("job", "title company")
      .populate("jobseeker", "name email experience skills resume");

    res.json(heldApplicants);
  } catch (err) {
    console.error("Error fetching held applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/accepted-applicants", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view this" });
    }

    const jobs = await Job.find({ postedBy: req.user.id });

    const acceptedApplicants = await Application.find({
      job: { $in: jobs.map((j) => j._id) },
      status: "accepted",
    })
      .populate("job", "title company")
      .populate("jobseeker", "name email experience skills resume");

    res.json(acceptedApplicants);
  } catch (err) {
    console.error("Error fetching accepted applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🚀 Get unseen jobs for THIS user
router.get("/unseen", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Fetch all jobs that user hasn't seen
    const jobs = await Job.find({
      _id: { $nin: user.seenJobs },
    }).sort({ createdAt: -1 }); // newest first

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unseen jobs" });
  }
});




/** GET /jobs/:id -> single job */

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


// ✅ Mark job as seen
router.post("/:id/seen", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { seenJobs: req.params.id }, // avoids duplicates
      $set: { lastSeenJob: req.params.id }    // save last seen
    });

    res.json({ message: "Job marked as seen" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark job as seen" });
  }
});
// ✅ Update a job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can update jobs" });
    }

    const jobId = req.params.id;

    // update only if job belongs to logged-in recruiter
    const job = await Job.findOneAndUpdate(
      { _id: jobId, postedBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json(job);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can delete jobs" });
    }

    const jobId = req.params.id;

    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: req.user.id });

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Invalid job id" });
  }
});




export default router;
