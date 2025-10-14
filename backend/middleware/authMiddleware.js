import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user in DB (make sure still valid)
    const user = await User.findById(decoded.id).select("_id role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach full user object to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
