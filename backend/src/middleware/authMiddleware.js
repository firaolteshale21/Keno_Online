const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};
