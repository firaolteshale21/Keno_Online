const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update this for production)
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle player joining a game session
  socket.on("joinGame", async (data) => {
    const { gameSessionId, userId } = data;

    // Add the player to the game session
    const gameSession = await GameSession.findByPk(gameSessionId);
    if (gameSession) {
      gameSession.players.push(userId);
      await gameSession.save();

      socket.join(gameSessionId); // Join the game session room
      io.to(gameSessionId).emit("playerJoined", {
        userId,
        players: gameSession.players,
      });
      console.log(`User ${userId} joined game session ${gameSessionId}`);
    }
  });

  // Handle player placing a bet
  socket.on("placeBet", async (data) => {
    const { gameSessionId, userId, selectedNumbers, betAmount } = data;

    // Save the bet to the database
    const bet = await Bet.create({
      user_id: userId,
      game_session_id: gameSessionId,
      selected_numbers: selectedNumbers,
      bet_amount: betAmount,
    });

    // Broadcast the bet to all players in the game session
    io.to(gameSessionId).emit("betPlaced", { userId, bet });
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
