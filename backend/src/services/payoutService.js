const { Bet, User, Transaction, GameSetting } = require("../models");
const { v4: uuidv4 } = require("uuid");

/**
 * Get RTP from Database
 */
const getRTP = async () => {
  const setting = await GameSetting.findOne();
  return setting ? setting.rtp / 100 : 0.85; // Convert RTP to decimal
};

/**
 * Adjust Paytable Based on RTP
 */
  const adjustPaytable = async () => {
    const rtp = await getRTP();

    let adjustedPaytable = {
      1: { 1: 3 },
      2: { 1: 1, 2: 5 },
      3: { 2: 2, 3: 10 },
      4: { 2: 1, 3: 5, 4: 20 },
      5: { 2: 1, 3: 3, 4: 15, 5: 50 },
      6: { 3: 2, 4: 10, 5: 50, 6: 300 },
      7: { 3: 3, 4: 15, 5: 150, 6: 750, 7: 1500 },
      8: { 4: 4, 5: 20, 6: 100, 7: 1000, 8: 3000 },
    };

    // ✅ Scale payouts dynamically based on RTP
    Object.keys(adjustedPaytable).forEach((numPicked) => {
      Object.keys(adjustedPaytable[numPicked]).forEach((matches) => {
        adjustedPaytable[numPicked][matches] *= rtp;  //* We can make this line "rtp = 1 if we need STATIC PAYTABLE
      });
    });

    return adjustedPaytable;
  };

/**
 * Process Bets & Ensure RTP-Adjusted Payouts are Stored
 */
const processBets = async (io, gameRoundId, drawnNumbers) => {
  try {
    const adjustedPaytable = await adjustPaytable();
    const bets = await Bet.findAll({ where: { gameRoundId } });

    for (const bet of bets) {
      const user = await User.findByPk(bet.userId);
      if (!user) continue;

      // ✅ Ensure reliable number matching using a Set for fast lookup
      const drawnSet = new Set(drawnNumbers);
      const matches = bet.numbersChosen.filter((num) =>
        drawnSet.has(num)
      ).length;

      let payoutMultiplier =
        adjustedPaytable[bet.numbersChosen.length]?.[matches] || 0;
      let payout = bet.betAmount * payoutMultiplier;

      if (payout > 0) {
        await user.increment("balance", { by: payout });

        await Transaction.create({
          id: uuidv4(),
          userId: user.id,
          betId: bet.id,
          type: "payout",
          amount: payout,
          status: "completed",
        });

        // ✅ Update the Bet with the Correct Winning Amount
        bet.status = "won";
        bet.winningAmount = payout; // ✅ Store actual winning amount
      } else {
        bet.status = "lost";
        bet.winningAmount = 0; // ✅ Ensure losing bets have 0 winningAmount
      }

      await bet.save();
    }

    io.emit("roundComplete", {
      drawnNumbers,
      message: "Round complete! Winners have been paid.",
    });
  } catch (error) {
    console.error("Error processing bets:", error);
  }
};

module.exports = { processBets };
