const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../models");
const jwt = require("jsonwebtoken");


/**
 * Generate a Random 6-Digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP (Simulated, replace with SMS API)
 */
const sendOTP = async (phoneNumber, otp) => {
  console.log(`📲 Sending OTP ${otp} to ${phoneNumber} (Simulated)`);
  return true; // In production, integrate an SMS API
};

/**
 * Register a new User
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, password, dateOfBirth } = req.body;

    if (!firstName || !lastName || !phoneNumber || !password || !dateOfBirth) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // ✅ Try to create user
    try {
      const user = await User.create({
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        dateOfBirth,
        balance: 0.0,
        otpCode,
        otpExpiresAt,
      });

      await sendOTP(phoneNumber, otpCode);
      return res.status(201).json({
        message: "Registration successful. OTP sent.",
        userId: user.id,
        phoneNumber: user.phoneNumber,
        
      });
    } catch (error) {
      console.error("Sequelize Validation Error:", error);
      return res.status(400).json({ error: error.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * Verify OTP
 */
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;

    if (!phoneNumber || !otpCode) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // ✅ Clear OTP after successful verification
    await user.update({ otpCode: null, otpExpiresAt: null });

    res.json({ message: "OTP verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*/**
 * User Login
 */
const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ error: "Phone number and password are required" });
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Ensure OTP is verified before allowing login
    if (user.otpCode !== null) {
      return res.status(400).json({ error: "OTP verification required before login." });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { registerUser, verifyOTP, loginUser };
