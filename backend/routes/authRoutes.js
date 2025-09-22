import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    if (age < 18) return res.status(400).json({ message: "Age must be 18+" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, age, role,lastSeenJob:null });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,   // 👈 send token to client
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      lastSeenJob:user.lastSeenJob,
      skills: user.skills,
      resume: user.resume,
      education: user.education,
      experience: user.experience,  
      preferredLocation: user.preferredLocation,
      expectedSalary: user.expectedSalary,
      availability: user.availability,
      
    }
  });
});

router.post("/last-seen", async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { lastSeenJob: jobId },
      { new: true }
    );

    res.json({ message: "Last seen job updated", lastSeenJob: updatedUser.lastSeenJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


