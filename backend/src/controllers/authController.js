const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { full_name, phone_number, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      full_name,
      phone_number,
      password_hash: hashedPassword,
      role: role || "player", // Default role is 'player'
      balance: 0.0,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res
      .status(201)
      .json({
        token,
        user: { id: user.id, full_name, phone_number, role: user.role },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res
      .status(200)
      .json({
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          phone_number,
          role: user.role,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout a user (optional, since JWT is stateless)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
