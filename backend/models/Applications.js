import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobseeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "rejected", "accepted", "hold"],
      default: "applied",
    },
    interview: {
      date: { type: Date },
      link: { type: String },
      status: {
        type: String,
        enum: ["none", "scheduled", "completed", "cancelled"],
        default: "none",
      },
    },
  },
  { timestamps: true }
);

// ✅ Ensure one unique application per job per jobseeker
applicationSchema.index({ job: 1, jobseeker: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
