import express from "express";
import Job from "../models/Job.js";

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

/** POST /jobs -> create job (we’ll protect later; for now open for seeding/tests) */
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
