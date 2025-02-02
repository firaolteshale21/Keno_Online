require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Required for WebSockets
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const dotenv = require("dotenv");
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });


app.use(cors());
app.use(express.json());

// Attach io to app
app.set("io", io);

// ✅ Store the global game state
let currentGameStatus = "inactive";
app.set("currentGameStatus", currentGameStatus);

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // ✅ Inform new player about current game state
  socket.emit("gameStatus", { status: app.get("currentGameStatus") });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

// ✅ Root page sample to say Keno is running
app.get("/", (req, res) => {
  res.send("Keno is running!");
});

// ✅ Emit new game started event (Now controlled within the game logic)
app.use("/api/game", require("./routes/gameRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/webhooks", require("./routes/chapaWebhook"));
app.use("/api/auth", require("./routes/authRoutes"));


if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = server;
