const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["recruiter", "jobseeker"] },
    age: { type: Number, required: true, min: [18, "Age must be 18 or above"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    isFirstLogin: { type: Boolean, default: true },  // ✅ NEW FIELD

    lastSeenJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },

    skills: { type: [String], default: [] },
    resume: { type: String, default: "" },
    education: { type: String, default: "" },

    experience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
      max: [50, "Experience seems unrealistic"],
    },

    preferredLocation: { type: String, default: "" },
    seenJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    expectedSalary: { type: String, default: "" },

    availability: {
      type: String,
      enum: ["immediate", "1 month", "2 months", "flexible"],
      default: "flexible",
    },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
