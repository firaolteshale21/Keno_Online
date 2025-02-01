const express = require("express");
const router = express.Router();
const { startGameRound } = require("../services/gameService");
const { placeBet } = require("../services/betService");
const { GameSetting } = require("../models");
const gameState = require("../utils/gameState");

router.post("/start-round", (req, res) => {
  const io = req.app.get("io"); 
  startGameRound(io);
  res.status(200).json({ message: "Game round started" });
});


/**
 * Player places a bet
 */
router.post("/place-bet", async (req, res) => {
  try {
    const io = req.app.get("io");
    const { userId, gameRoundId, selectedNumbers, amount } = req.body;

    if (!userId || !gameRoundId || !selectedNumbers || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bet = await placeBet(
      io,
      userId,
      gameRoundId,
      selectedNumbers,
      amount
    );
    return res.status(201).json({ message: "Bet placed successfully", bet });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
      return res.status(400).json({ error: "RTP must be fixed at 85%" });

    // ✅ Check if the current game round is active
    if (gameState.currentGameStatus === "active") {
      return res
        .status(400)
        .json({
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


module.exports = router;



