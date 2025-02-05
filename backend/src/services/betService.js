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

    // ✅ Debugging Balance Issue
    console.log("🔍 Checking balance for user:", userId);
    console.log("💰 User balance before bet:", user.balance);
    console.log("🎲 Bet amount:", amount);

    // ✅ Convert Balance to a Number (Fix Possible String Issue)
    const userBalance = parseFloat(user.balance);
    const betAmount = parseFloat(amount);

    if (isNaN(userBalance) || isNaN(betAmount)) {
      throw new Error("Balance or bet amount is not a valid number.");
    }

    if (userBalance < betAmount) {
      throw new Error("Insufficient balance");
    }

    // ✅ Deduct Bet Amount Correctly
    await user.decrement("balance", { by: betAmount });

    // ✅ Store Bet in Database
    const bet = await Bet.create({
      id: uuidv4(),
      userId,
      gameRoundId,
      numbersChosen: selectedNumbers,
      betAmount: betAmount,
      status: "pending",
    });

    // ✅ Log Transaction
    await Transaction.create({
      id: uuidv4(),
      userId,
      betId: bet.id,
      type: "bet",
      amount: betAmount,
      status: "completed",
    });

    // ✅ Fetch Updated Balance After Deduction
    const updatedUser = await User.findByPk(userId);
    console.log("✅ New user balance after bet:", updatedUser.balance);

    // ✅ Emit updated balance to frontend
    // ✅ Emit updated balance to frontend globally
    io.emit("balanceUpdated", { userId, newBalance: updatedUser.balance });

    // ✅ Notify All Players of New Bet
    io.emit("betPlaced", {
      userId,
      betId: bet.id,
      message: "A player has placed a bet!",
    });

    return bet;
  } catch (error) {
    console.error("❌ Error placing bet:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { placeBet };
