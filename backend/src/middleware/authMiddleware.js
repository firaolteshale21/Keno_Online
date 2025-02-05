const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token and authenticate users
 */
const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request object

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateUser;
