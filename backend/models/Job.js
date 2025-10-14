import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }, // short summary
    fullDescription: { type: String, default: "" }, // detailed description
    requirements: { type: [String], default: [] },
    salary: { type: String, default: "" },

    // Recruiter who posted the job
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔹 Job category/type (e.g. Software Developer, Marketing, HR, etc.)
    jobType: { type: String, required: true, trim: true },

    // 🔹 Minimum experience required (in years)
    minExperience: { type: Number, default: 0, min: 0 },

    // 🔹 Work mode (in office / remote / hybrid)
    workMode: {
      type: String,
      enum: ["In Office", "Remote", "Hybrid"],
      default: "In Office",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
