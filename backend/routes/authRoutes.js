import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

/* ================================================================
   🟢 SIGNUP
================================================================ */
router.post("/signup", async (req, res) => {
  try {
    console.log("📩 Signup request received:", req.body);

    const { name, email, password, age, role } = req.body;

    if (age < 18) {
      console.warn("⚠️ Signup failed: age < 18");
      return res.status(400).json({ message: "Age must be 18+" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Signup failed: User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // ⚠️ Important: hash password before saving!
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      role,
      lastSeenJob: null,
    });

    console.log("✅ User registered successfully:", user.email);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================================================================
   🟢 LOGIN
================================================================ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login request received for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ Login failed: user not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    let isMatch = false;

    // ✅ Check if password is hashed (starts with bcrypt hash pattern)
    const isHashed = user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    if (isHashed) {
      // Compare with bcrypt
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Direct string comparison
      isMatch = password === user.password;
    }

    if (!isMatch) {
      console.warn("⚠️ Login failed: invalid password for:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        lastSeenJob: user.lastSeenJob,
        skills: user.skills,
        resume: user.resume,
        education: user.education,
        experience: user.experience,
        preferredLocation: user.preferredLocation,
        expectedSalary: user.expectedSalary,
        availability: user.availability,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================================================================
   🟢 LAST SEEN JOB
================================================================ */
router.post("/last-seen", async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    console.log(`🧩 Updating last seen job for user ${userId} → job ${jobId}`);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { lastSeenJob: jobId },
      { new: true }
    );

    console.log("✅ Last seen job updated for:", updatedUser.email);
    res.json({
      message: "Last seen job updated",
      lastSeenJob: updatedUser.lastSeenJob,
    });
  } catch (error) {
    console.error("❌ Last seen update error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================================================================
   🟢 FORGOT PASSWORD
================================================================ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("📩 Forgot password request for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ No user found with that email:", email);
      return res.status(404).json({ message: "No user found with that email." });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    console.log("🧩 Reset token generated:", resetToken);
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log("🔗 Reset link:", resetLink);

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📨 Sending email to:", email);
    await transporter.sendMail({
      from: `"WorkSpark" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("✅ Email sent successfully to:", email);
    res.json({ message: "Password reset link sent!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ message: err.message || "Something went wrong." });
  }
});

/* ================================================================
   🟢 RESET PASSWORD
================================================================ */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("📩 Reset password request for token:", token);

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.warn("⚠️ Invalid or expired token:", token);
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    console.log("✅ Token valid for:", user.email);

    // ✅ Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    console.log("🔒 Password reset successful for:", user.email);
    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: err.message || "Something went wrong." });
  }
});

export default router;
