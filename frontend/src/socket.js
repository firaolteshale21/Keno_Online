import { io } from "socket.io-client";

// ✅ Connect to the backend WebSocket server
const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default socket;
