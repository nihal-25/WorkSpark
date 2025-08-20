import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    salary: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // recruiter id (optional for now)
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
