//check SavedJobs to see how its handling saving only unique entries
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "rejected", "accepted"],
      default: "applied",
    },
  },
  { timestamps: true }
);
const Application = mongoose.model("Application", applicationSchema);
export default Application;
