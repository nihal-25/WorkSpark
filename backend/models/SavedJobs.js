// models/SavedJob.js
import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true,},
    jobseeker: {
      type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},},
  { timestamps: true }
);

// prevent duplicates (same user saving same job twice)
savedJobSchema.index({ job: 1, jobseeker: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);
