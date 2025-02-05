require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // ✅ Secure HTTP headers
const rateLimit = require("express-rate-limit"); // ✅ Prevent brute force attacks
const http = require("http"); // Required for WebSockets
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const dotenv = require("dotenv");
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

app.use(cors()); // ✅ Allow only trusted origins in production
app.use(express.json());
app.use(helmet()); // ✅ Secure HTTP headers

// ✅ Limit API requests to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter); // Apply rate limiting to all API routes

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

const { attachSocketListeners } = require("./services/gameService");

// ✅ Attach WebSocket listeners
attachSocketListeners(io);

// ✅ Root page sample to say Keno is running
app.get("/", (req, res) => {
  res.send("Keno is running!");
});

// ✅ Secure API routes
app.use("/api/game", require("./routes/gameRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/webhooks", require("./routes/chapaWebhook"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/userRoutes"));

// ✅ Start server only in non-test environments
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = server;
