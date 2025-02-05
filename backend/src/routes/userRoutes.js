const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authenticateUser = require("../middleware/authMiddleware"); // Import middleware

// ✅ Secure Route: Fetch User Details After Login
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ["id", "firstName", "lastName", "phoneNumber", "balance"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
