import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup route (already exists)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    if (age < 18) {
      return res.status(400).json({ message: "Age must be 18 or above" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, age, role });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password (⚠️ later we’ll add bcrypt hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // if success - send only safe fields
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,  // 👈 important for redirect
        age: user.age,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
