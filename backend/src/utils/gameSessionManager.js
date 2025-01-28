class GameSessionManager {
  constructor() {
    this.gameSessions = new Map(); // Stores active game sessions
  }

  // Start a new game session
  startGameSession(gameSessionId) {
    const gameSession = {
      id: gameSessionId,
      status: "waiting",
      players: [],
      timer: null,
      drawNumbers: [],
    };
    this.gameSessions.set(gameSessionId, gameSession);

    // Start the timer for the game session
    gameSession.timer = setInterval(() => {
      this.drawNumbers(gameSessionId);
    }, 60000); // 1-minute timer

    return gameSession;
  }

  // Draw 20 random numbers for a game session
  drawNumbers(gameSessionId) {
    const gameSession = this.gameSessions.get(gameSessionId);
    if (gameSession) {
      gameSession.drawNumbers = Array.from(
        { length: 20 },
        () => Math.floor(Math.random() * 80) + 1
      );
      gameSession.status = "in_progress";

      // Broadcast the drawn numbers to all players
      io.to(gameSessionId).emit("numbersDrawn", {
        drawNumbers: gameSession.drawNumbers,
      });

      // End the game session after 1 minute
      setTimeout(() => {
        this.endGameSession(gameSessionId);
      }, 60000); // 1-minute duration
    }
  }

  // End a game session
  endGameSession(gameSessionId) {
    const gameSession = this.gameSessions.get(gameSessionId);
    if (gameSession) {
      clearInterval(gameSession.timer); // Stop the timer
      gameSession.status = "completed";

      // Broadcast the end of the game session
      io.to(gameSessionId).emit("gameEnded", { gameSession });

      // Remove the game session from the manager
      this.gameSessions.delete(gameSessionId);
    }
  }
}

module.exports = new GameSessionManager();
