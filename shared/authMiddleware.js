import { verifyToken } from "./userHelpers.js";

// Middleware to protect routes
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Access denied. No token." });

  // Expected format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid or expired token." });

  req.user = decoded; // attach user info to request
  next();
};
