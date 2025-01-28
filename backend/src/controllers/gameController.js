const { GameSession, Bet } = require("../models");
const gameSessionManager = require("../utils/gameSessionManager");

// Start a new game session
exports.startGameSession = async (req, res) => {
  try {
    const { userId } = req.body;

    // Create a new game session in the database
    const gameSession = await GameSession.create({
      status: "waiting",
      players: [userId],
    });

    // Start the game session in the manager
    gameSessionManager.startGameSession(gameSession.id);

    res.status(201).json({ gameSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Place a bet
exports.placeBet = async (req, res) => {
  try {
    const { gameSessionId, userId, selectedNumbers, betAmount } = req.body;

    // Save the bet to the database
    const bet = await Bet.create({
      user_id: userId,
      game_session_id: gameSessionId,
      selected_numbers: selectedNumbers,
      bet_amount: betAmount,
    });

    res.status(201).json({ bet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
