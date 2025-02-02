const express = require("express");
const {
  registerUser,
  verifyOTP,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * User Registration Route (Sends OTP)
 */
router.post("/register", registerUser);

/**
 * OTP Verification Route
 */
router.post("/verify-otp", verifyOTP);

/**
 * User Login Route
 */
router.post("/login", loginUser);

module.exports = router;
