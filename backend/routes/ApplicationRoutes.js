import express from "express";
import Application from "../models/Applications.js";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all applications for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ jobseeker: req.user.id }).populate("job");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Apply for a job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { job } = req.body;
    if (!job) return res.status(400).json({ message: "Job ID is required" });

    const jobExists = await Job.findById(job);
    if (!jobExists) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ job, jobseeker: req.user.id });
    if (existing) return res.status(409).json({ message: "You already applied for this job" });

    const newApplication = await Application.create({ job, jobseeker: req.user.id });
    res.status(201).json(newApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Withdraw application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, jobseeker: req.user.id });
    if (!application) return res.status(404).json({ message: "Application not found" });

    await application.deleteOne();
    res.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update application status (Recruiter or Jobseeker)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["applied", "accepted", "rejected", "hold"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // 🔒 If recruiter → must own job
    if (req.user.role === "recruiter") {
      if (String(application.job.postedBy) !== String(req.user.id))
        return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 If jobseeker → must own application
    if (req.user.role === "jobseeker") {
      if (String(application.jobseeker) !== String(req.user.id))
        return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application status set to ${status}`, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Schedule interview (Recruiter only)
router.patch("/:id/schedule", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can schedule interviews" });

    const { date, link } = req.body;
    if (!date || !link)
      return res.status(400).json({ message: "Interview date and link are required" });

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Ensure recruiter owns this job
    if (String(application.job.postedBy) !== String(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    application.interview = {
      date,
      link,
      status: "scheduled",
    };
    await application.save();

    res.json({ message: "Interview scheduled successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ View scheduled interviews (for logged-in jobseeker)
router.get("/my-interviews", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Fetching interviews for user:", req.user.id);

    const interviews = await Application.find({
      jobseeker: req.user.id,
      "interview.status": "scheduled",
    })
      .populate("job", "title company location")
      .sort({ "interview.date": 1 });

    console.log("📊 Interviews found:", interviews.length);
    res.json(interviews);
  } catch (err) {
    console.error("❌ Error fetching interviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Cancel interview (Recruiter only)
router.patch("/:id/cancel-interview", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can cancel interviews" });

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (String(application.job.postedBy) !== String(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    application.interview.status = "cancelled";
    await application.save();

    res.json({ message: "Interview cancelled successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
