const { Bet, User, Transaction, GameSetting, GameAnalytics } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { NumberAnalytics } = require("../models");
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
        adjustedPaytable[numPicked][matches] *= 1;  //* We can make this line "rtp = 1 if we need STATIC PAYTABLE
      });
    });

    return adjustedPaytable;
  };

/**
 * Track RTP & Financial Metrics
 */
const trackRTP = async (gameRoundId, totalBets, totalPayouts) => {
  const netProfit = totalBets - totalPayouts;
  const actualRTP = totalBets > 0 ? (totalPayouts / totalBets) * 100 : 0;

  await GameAnalytics.create({
    id: uuidv4(), // ✅ Ensure ID is generated
    gameRoundId,
    totalBets: totalBets.toFixed(2),
    totalPayouts: totalPayouts.toFixed(2),
    netProfit: netProfit.toFixed(2),
    actualRTP: actualRTP.toFixed(2),
  });

  return actualRTP;
};


/**
 * Track Hot & Cold Numbers
 */
const trackNumberAnalytics = async (drawnNumbers) => {
  for (let number of drawnNumbers) {
    const existingRecord = await NumberAnalytics.findOne({ where: { number } });

    if (existingRecord) {
      await existingRecord.increment("drawnCount", { by: 1 });
    } else {
      await NumberAnalytics.create({ number, drawnCount: 1 });
    }
  }
};

/**
 * Process Bets & Store RTP Analytics
 */
const processBets = async (io, gameRoundId, drawnNumbers) => {
  try {
    const adjustedPaytable = await adjustPaytable();
    const bets = await Bet.findAll({ where: { gameRoundId } });

    if (!bets || bets.length === 0) {
      console.log("❌ No bets found for this round.");
      return [];
    }

    let totalBets = 0;
    let totalPayouts = 0;
    let winners = [];

    for (const bet of bets) {
      const user = await User.findByPk(bet.userId);
      if (!user) continue;

      totalBets += parseFloat(bet.betAmount) || 0;
      const drawnSet = new Set(drawnNumbers);
      const matches = bet.numbersChosen.filter((num) =>
        drawnSet.has(num)
      ).length;
      let payoutMultiplier =
        adjustedPaytable[bet.numbersChosen.length]?.[matches] || 0;
      let payout = parseFloat(bet.betAmount * payoutMultiplier) || 0;

      totalPayouts += payout;
      if (payout > 0) {
        await user.increment("balance", { by: payout });

        io.emit("balanceUpdated", {
          userId: user.id,
          newBalance: user.balance + payout,
        });
        await user.increment("balance", { by: payout });

        await Transaction.create({
          userId: user.id,
          betId: bet.id,
          type: "payout",
          amount: payout.toFixed(2),
          status: "completed",
        });

        bet.status = "won";
        bet.winningAmount = payout.toFixed(2);

        // ✅ Store winners
        winners.push({ userId: user.id, winnings: payout });

      } else {
        bet.status = "lost";
        bet.winningAmount = 0;
      }

      await bet.save();
    }
    // ✅ Ensure proper numeric formatting
    const actualRTP = await trackRTP(gameRoundId, totalBets, totalPayouts);

    io.emit("roundComplete", {
      drawnNumbers,
      actualRTP,
      netProfit: totalBets - totalPayouts,
      message: "Round complete! Winners have been paid.",
    });

    return winners; // ✅ Return winners array
  } catch (error) {
    console.error("Error processing bets:", error);
    return [];
  }
};

module.exports = { processBets, trackNumberAnalytics };
