const { Bet, User, Transaction, GameRound } = require("../models");
const { v4: uuidv4 } = require("uuid");
const gameState = require("../utils/gameState");

/**
 * Validate & Place a Bet
 */
const placeBet = async (io, userId, gameRoundId, selectedNumbers, amount) => {
  try {
    // ✅ Validate User Exists
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    // ✅ Validate Game Round
    const gameRound = await GameRound.findByPk(gameRoundId);
    if (!gameRound) throw new Error("Game round not found");

    // ✅ Ensure Betting is Open
    if (gameRound.status !== "open") {
      throw new Error("Betting is closed for this round.");
    }

    // ✅ Validate Player Balance
    if (user.balance < amount) throw new Error("Insufficient balance");

    // ✅ Validate Bet Amount (Set Limits if Needed)
    if (amount < 1 || amount > 10000) {
      throw new Error("Bet amount must be between 1 and 10,000.");
    }

    // ✅ Validate Selected Numbers (Must be between 1 and 8 numbers)
    if (selectedNumbers.length < 1 || selectedNumbers.length > 8) {
      throw new Error("You must select between 1 and 8 numbers.");
    }

    // ✅ Ensure Numbers are Unique
    if (new Set(selectedNumbers).size !== selectedNumbers.length) {
      throw new Error("Duplicate numbers are not allowed.");
    }

    // ✅ Ensure Numbers are Within 1-80
    if (!selectedNumbers.every((num) => num >= 1 && num <= 80)) {
      throw new Error("Numbers must be between 1 and 80.");
    }

    // ✅ Deduct Bet Amount
    await user.decrement("balance", { by: amount });

    // ✅ Store Bet in Database
    const bet = await Bet.create({
      id: uuidv4(),
      userId,
      gameRoundId,
      numbersChosen: selectedNumbers,
      betAmount: amount,
      status: "pending",
    });

    // ✅ Log Transaction
    await Transaction.create({
      id: uuidv4(),
      userId,
      betId: bet.id,
      type: "bet",
      amount,
      status: "completed",
    });

    // ✅ Notify All Players of New Bet
    io.emit("betPlaced", {
      userId,
      betId: bet.id,
      message: "A player has placed a bet!",
    });

    return bet;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { placeBet };
