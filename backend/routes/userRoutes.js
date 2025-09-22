//idk if this is used or not #need to check
import express from "express";
import User from "../models/User.js";   // ✅ relative import with .js extension
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// @desc   Get all users
// @route  GET /users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();   // fetch all users from MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, age, email, password } = req.body;
    const newUser = await User.create({ name, role, age, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
