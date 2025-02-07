const { Bet, User, Transaction, GameRound } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { adjustPaytable } = require("./payoutService"); // ✅ Import paytable function
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

    console.log("🔍 Checking balance for user:", userId);
    console.log("💰 User balance before bet:", user.balance);
    console.log("🎲 Bet amount:", amount);

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

    // ✅ Get Adjusted Paytable for Possible Winnings Calculation
    const adjustedPaytable = await adjustPaytable();

    // ✅ Calculate Possible Winnings Using the Paytable
    const numSelected = selectedNumbers.length;
    let maxMultiplier = 0;

    if (adjustedPaytable[numSelected]) {
      maxMultiplier = Math.max(...Object.values(adjustedPaytable[numSelected]));
    }

    const possibleWinningAmount = betAmount * maxMultiplier;

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

    // ✅ Emit updated balance to frontend globally
    io.emit("balanceUpdated", { userId, newBalance: updatedUser.balance });

    // ✅ Emit new bet event with correct possible winnings
    io.emit("newBetPlaced", {
      betId: bet.id,
      selectedNumbers,
      possibleWinningAmount,
      actualWinningAmount: 0, // Initially 0
    });

    return bet;
  } catch (error) {
    console.error("❌ Error placing bet:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { placeBet };
