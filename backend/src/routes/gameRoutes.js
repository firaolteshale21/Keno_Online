const express = require("express");
const router = express.Router();
const { startGameRound } = require("../services/gameService");
const { placeBet } = require("../services/betService");
const { GameSetting } = require("../models");
const gameState = require("../utils/gameState");
const { GameAnalytics, NumberAnalytics } = require("../models");
const { User } = require("../models");
const authenticateUser = require("../middleware/authMiddleware"); // Import middleware


router.post("/start-round", (req, res) => {
  const io = req.app.get("io"); 
  startGameRound(io);
  res.status(200).json({ message: "Game round started" });
});

/**
 * Player Bet
 */
// ✅ Secure Betting Endpoint
router.post("/place-bet", authenticateUser, async (req, res) => {
  try {
    const io = req.app.get("io");
    const { gameRoundId, selectedNumbers, amount } = req.body;
    const userId = req.userId; // ✅ Get user ID from JWT, preventing ID tampering

    // ✅ Validate required fields
    if (!gameRoundId || !selectedNumbers || !amount) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Ensure game round is open for betting (STRICT CHECK)
    if (gameState.currentGameStatus !== "betting") {
      return res
        .status(400)
        .json({ error: "Betting is closed. Please wait for the next round." });
    }

    // ✅ Process bet securely
    const bet = await placeBet(
      io,
      userId,
      gameRoundId,
      selectedNumbers,
      amount
    );

    return res
      .status(201)
      .json({ message: "✅ Bet placed successfully!", bet });
  } catch (error) {
    console.error("❌ Error placing bet:", error.message);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
});

/**
 * Get current RTP
 */

router.get("/rtp", async (req, res) => {
  try {
    const rtp = await GameSetting.findOne({ where: {} }).then((setting) => {
      return setting.rtp;
    });
    return res.status(200).json({ rtp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Update RTP (Admin Only, but NOT during an active game round)
 */
router.put("/rtp", async (req, res) => {
  try {
    const { rtp } = req.body;
    if (rtp < 85)
      return res.status(400).json({ error: "RTP cant not be less than 85%" });

    // ✅ Check if the current game round is active
    if (gameState.currentGameStatus === "drawing") {
      return res.status(400).json({
        error:
          "Cannot change RTP during an active game round. Try again after the round ends.",
      });
    }

    await GameSetting.update({ rtp }, { where: {} });
    res.status(200).json({ message: "RTP updated successfully", rtp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Current Volatility
 */
router.get("/volatility", async (req, res) => {
  try {
    const setting = await GameSetting.findOne();
    res.status(200).json({ volatility: setting.volatility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update Volatility (Admin Only)
 */
router.put("/volatility", async (req, res) => {
  try {
    const { volatility } = req.body;
    if (!["low", "medium", "high"].includes(volatility)) {
      return res.status(400).json({ error: "Invalid volatility level" });
    }

    await GameSetting.update({ volatility }, { where: {} });
    res.status(200).json({ message: "Volatility updated successfully", volatility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Get RTP & Financial Reports (Admin Only)
 */
router.get("/analytics", async (req, res) => {
  try {
    const analytics = await GameAnalytics.findAll({
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // ✅ Calculate Average RTP Over Time
    let totalBets = 0,
      totalPayouts = 0,
      totalRounds = analytics.length;
    analytics.forEach((round) => {
      totalBets += parseFloat(round.totalBets);
      totalPayouts += parseFloat(round.totalPayouts);
    });
    const averageRTP = totalRounds > 0 ? (totalPayouts / totalBets) * 100 : 0;

    res.status(200).json({
      message: "RTP Analytics Report",
      averageRTP: averageRTP.toFixed(2),
      analytics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Hot & Cold Numbers
 */
router.get("/number-trends", async (req, res) => {
  try {
    const hotNumbers = await NumberAnalytics.findAll({ order: [["drawnCount", "DESC"]], limit: 5 });
    const coldNumbers = await NumberAnalytics.findAll({ order: [["drawnCount", "ASC"]], limit: 5 });

    res.status(200).json({
      hotNumbers,
      coldNumbers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



