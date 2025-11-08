//idk if this is used or not #need to check
import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";   
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

// Only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

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

router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"), // frontend should send field name "resume"
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Save file path in user model
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { resume: req.file.path },
        { new: true }
      );

      res.json({ message: "Resume uploaded successfully", resume: user.resume });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  }
);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Update logged-in user's profile
// @route  PUT /users/me
router.put("/me", authMiddleware, async (req, res) => {
  try {
    // only allow certain fields to be updated
    const allowedUpdates = [
      "name",
      "role",
      "skills",
      "resume",
      "education",
      "experience",
      "preferredLocation",
      "expectedSalary",
      "availability"
    ];
    
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
