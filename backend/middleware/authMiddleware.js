// middleware/authMiddleware.js
//this is used to get login token from the header and verify it to do further operations like fetch user data
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  //header needs Authorization along with token
  const token = authHeader.split(" ")[1]; // Expects "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info in request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
