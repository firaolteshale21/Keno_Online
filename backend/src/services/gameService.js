const { GameRound } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { generateKenoNumbers } = require("./rngService");
const { processBets, trackNumberAnalytics } = require("./payoutService");
const {User} = require("../models");
const gameState = require("../utils/gameState")


let activeGameRound = null;
let gameInProgress = false;
let drawnNumbersHistory = []; // ✅ Store drawn numbers globally

/**
 * Start a new Keno game round
 */
const startGameRound = async (io, app) => {
  if (gameInProgress) return;

  gameInProgress = true;
  console.log("Starting new game round in 5 seconds...");

  // Emit a countdown for the next round
  for (let i = 5; i > 0; i--) {
    setTimeout(() => {
      io.emit("timerUpdate", {
        message: `New round starting in`,
        timeLeft: i,
        phase: "countdown",
      });
    }, (5 - i) * 1000);
  }

  // Start the betting phase after the countdown
  setTimeout(async () => {
    console.log("Betting phase started!");
    activeGameRound = await GameRound.create({
      id: uuidv4(),
      drawnNumbers: [],
      status: "open",
      startTime: new Date(),
    });

    console.log("✅ Active gameRoundId:", activeGameRound.id); // Debugging

    gameState.currentGameStatus = "betting"; // ✅ Set game state to betting

    io.emit("newRoundID", {
      message: "Place your bets!",
      timeLeft: 60,
      phase: "betting",
      gameRoundId: activeGameRound.id, // ✅ Send gameRoundId correctly
      gameStatus: "betting", // ✅ Send game status
    });

    // Emit game status update globally
    io.emit("gameStatus", { status: "betting" });

    // Countdown for the betting phase
    for (let i = 60; i > 0; i--) {
      setTimeout(() => {
        io.emit("timerUpdate", {
          message: "Place your bets!",
          timeLeft: i,
          phase: "betting",
        });
      }, (60 - i) * 1000);
    }

    // Start drawing numbers after the betting phase
    setTimeout(() => {
      gameState.currentGameStatus = "drawing"; // ✅ Update game state to drawing
      io.emit("gameStatus", { status: "drawing" }); // ✅ Notify frontend that drawing started
      drawNumbers(io, app, activeGameRound.id);
    }, 60000);
  }, 5000);
};

/**
 * Draw numbers in real-time and store them
 */
let gamePhase = "betting"; // ✅ Track game phase globally
const drawNumbers = async (io, app, gameRoundId) => {
  console.log("Drawing numbers...");
  drawnNumbersHistory = []; // ✅ Reset at the start of a new round
  gamePhase = "drawing"; // ✅ Set phase to drawing

  const numbers = await generateKenoNumbers();

  io.emit("timerUpdate", {
    message: "Round Started!",
    timeLeft: "",
    phase: "drawing",
  });

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      drawnNumbersHistory.push(numbers[i]); // ✅ Store drawn numbers globally
      io.emit("drawNumber", {
        message: `Drawing Phase: ${i + 1}/20`,
        number: numbers[i],
        drawnSoFar: drawnNumbersHistory,
      });

      if (drawnNumbersHistory.length === 20) {
        completeGameRound(io, app, drawnNumbersHistory, gameRoundId);
      }
    }, i * 1000);
  }
};

/**
 * Complete the game round and process bets
 */
const completeGameRound = async (io, app, drawnNumbers, gameRoundId) => {
  console.log("🏆 Completing game round...");

  const gameRound = await GameRound.findByPk(gameRoundId);
  if (!gameRound) {
    console.error("❌ Game round not found.");
    return;
  }

  gameRound.drawnNumbers = drawnNumbers;
  gameRound.status = "completed";
  await gameRound.save();

  // ✅ Process bets and update balances
  const winners = await processBets(io, gameRound.id, drawnNumbers);
  trackNumberAnalytics(drawnNumbers); // ✅ Track number analytics for winners

  if (!winners || !Array.isArray(winners)) {
    console.warn("⚠️ No winners found, or processBets() returned undefined.");
  } else {
    console.log("🎉 Winners processed:", winners);

    // ✅ Emit balance updates for winners
    winners.forEach(async (winner) => {
      const updatedUser = await User.findByPk(winner.userId);
      if (updatedUser) {
        io.to(updatedUser.id).emit("balanceUpdated", updatedUser.balance);
      }
    });
  }

  io.emit("roundComplete", { message: "Round Complete!" });

  gamePhase = "post-draw"; // ✅ Set to post-draw for 5 seconds

  // ✅ Keep numbers visible for 5 seconds, then clear
  setTimeout(() => {
    gamePhase = "betting"; // ✅ Reset phase to betting
    drawnNumbersHistory = []; // ✅ Clear drawn numbers
  }, 5000);

  // Wait 5 seconds, then reset for the next round
  setTimeout(() => {
    io.emit("newRound", {
      message: "Place your bets!",
      timeLeft: 60,
      phase: "betting",
    });
    gameInProgress = false;
    startGameRound(io, app);
  }, 5000);
};

// ✅ Send stored drawn numbers when new players connect
const attachSocketListeners = (io) => {
  io.on("connection", (socket) => {
    // ✅ Send previous numbers only if in "drawing" or "post-draw" phase
    if (gamePhase === "drawing" || gamePhase === "post-draw") {
      console.log("🔄 Sending previous drawn numbers to new player.");
      socket.emit("currentGameState", {
        drawnNumbers: drawnNumbersHistory,
      });
    } else {
      console.log("❌ Clearing numbers for new player (not in drawing phase).");
      socket.emit("currentGameState", {
        drawnNumbers: [], // ✅ Send empty array after 5 seconds
      });
    }

    // ✅ Send the active game round to new players when they connect
    if (activeGameRound) {
      console.log(
        "🔄 Sending active game round to new player:",
        activeGameRound.id
      );
      socket.emit("activeGameRound", { gameRoundId: activeGameRound.id });
    } else {
      console.warn("⚠️ No active game round available for new player.");
    }
    // ✅ Send current game state to new players upon joining
    socket.emit("currentGameState", {
      gameStatus: gameState.currentGameStatus, // ✅ Send current game status
      gameRoundId: activeGameRound ? activeGameRound.id : null, // ✅ Send active game round
    });
  });
};


module.exports = {
  startGameRound,
  drawNumbers,
  completeGameRound,
  attachSocketListeners,
};
