const express = require("express");
const gameController = require("../controllers/gameController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Start a new game session
router.post("/start", authenticate, gameController.startGameSession);

// Draw numbers for a game session
router.post("/:gameSessionId/draw", authenticate, gameController.drawNumbers);

module.exports = router;
