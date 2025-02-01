const { GameRound } = require("../models");
const { v4: uuidv4 } = require("uuid");
const gameState = require("../utils/gameState");
const { generateKenoNumbers } = require("./rngService");
const { processBets } = require("./payoutService");

let activeGameRound = null;
let gameInProgress = false; // Prevent multiple rounds from running

/**
 * Start a new Keno game round
 */
const startGameRound = async (io, app) => {
  if (gameInProgress) return;

  gameInProgress = true;
  console.log("Starting new game round...");
  gameState.currentGameStatus = "active"; // ✅ Mark round as active

  activeGameRound = await GameRound.create({
    id: uuidv4(),
    drawnNumbers: [],
    status: "open",
    startTime: new Date(),
  });

  io.emit("newRound", {
    gameRoundId: activeGameRound.id,
    message: "New round started! Place your bets.",
  });

  // ✅ Wait 1 minute for betting before drawing numbers
  setTimeout(() => drawNumbers(io, app, activeGameRound.id), 60000);
};

/**
 * Draw Keno Numbers in Real-Time with Volatility-Based Weighting
 */
const drawNumbers = async (io, app, gameRoundId) => {
  console.log("Drawing numbers for game round:", gameRoundId);

  let drawnNumbers = [];
  const numbers = await generateKenoNumbers(); // ✅ Use volatility-based RNG

  for (let i = 0; i < 20; i++) {
    setTimeout(async () => {
      drawnNumbers.push(numbers[i]);
      io.emit("drawNumber", { number: numbers[i], drawnSoFar: drawnNumbers });

      if (drawnNumbers.length === 20) {
        await completeGameRound(io, app, drawnNumbers, gameRoundId);
      }
    }, i * 1000);
  }
};

/**
 * Complete the game round and process bets
 */
const completeGameRound = async (io, app, drawnNumbers, gameRoundId) => {
  console.log("🏆 Completing game round...");
  gameState.currentGameStatus = "inactive";

  const gameRound = await GameRound.findByPk(gameRoundId);
  if (!gameRound) {
    console.error("Error: No active game round found!");
    return;
  }

  gameRound.drawnNumbers = drawnNumbers;
  gameRound.status = "completed";
  await gameRound.save();

  // Pass drawnNumbers to processBets
  await processBets(io, gameRound.id, drawnNumbers);


  // ✅ Reset game state and start a new round after 10 seconds
  gameInProgress = false;
  setTimeout(() => startGameRound(io, app), 10000);
};

module.exports = {
  startGameRound,
  drawNumbers,
  completeGameRound,
};
