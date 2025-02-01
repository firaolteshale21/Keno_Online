const { GameSetting } = require("../models");

/**
 * Generate Keno numbers with varied weighted probability per round based on volatility
 */
const generateKenoNumbers = async () => {
  const setting = await GameSetting.findOne();
  const volatility = setting ? setting.volatility : "medium"; // Default to medium

  let numberPool = [];

  for (let i = 1; i <= 80; i++) {
    let weight = 1; // Default weight for all numbers

    if (volatility === "low") {
      if (i <= 20)
        weight = 3; // ✅ Higher weight for low numbers (frequent small wins)
      else weight = 1;
    } else if (volatility === "medium") {
      if (i <= 20) weight = 2;
      else if (i > 50) weight = 1.5; // ✅ Balanced distribution
      else weight = 1;
    } else if (volatility === "high") {
      if (i <= 20) weight = 1;
      else if (i > 50)
        weight = 2.5; // ✅ Higher weight for high numbers (big jackpots)
      else weight = 1;
    }

    for (let j = 0; j < weight * 10; j++) {
      numberPool.push(i);
    }
  }

  numberPool.sort(() => Math.random() - 0.5);

  let drawnNumbers = [];
  while (drawnNumbers.length < 20) {
    let pick = numberPool[Math.floor(Math.random() * numberPool.length)];
    if (!drawnNumbers.includes(pick)) {
      drawnNumbers.push(pick);
    }
  }

  return drawnNumbers;
};

module.exports = { generateKenoNumbers };
