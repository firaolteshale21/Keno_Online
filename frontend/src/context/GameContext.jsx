import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";

// ✅ Create Game Context
const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameRoundId, setGameRoundId] = useState(null);
  const [gameStatus, setGameStatus] = useState("betting"); // Default to "betting"
  const [selectedNumbers, setSelectedNumbers] = useState([]); // ✅ Store selected numbers

  // ✅ Fetch the latest game state when a new player joins
  const fetchGameState = () => {
    socket.emit("requestGameState"); // ✅ Ask the backend for the current game state
  };

  useEffect(() => {
    // ✅ Listen for game state updates
    socket.on("currentGameState", (data) => {
      console.log("🔄 Received game state update:", data);
      setGameRoundId(data.gameRoundId || null);
      setGameStatus(data.gameStatus || "betting");
    });

    socket.on("newRoundID", (data) => {
      console.log("🆕 New round started:", data.gameRoundId);
      setGameRoundId(data.gameRoundId);
      setGameStatus("betting");
      setSelectedNumbers([]); // ✅ Clear selected numbers on new round
    });

    socket.on("gameStatus", (data) => {
      console.log("🔄 Game status updated:", data.status);
      setGameStatus(data.status);
    });

    // ✅ Fetch the latest game state on mount
    fetchGameState();

    return () => {
      socket.off("currentGameState");
      socket.off("newRoundID");
      socket.off("gameStatus");
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameRoundId,
        gameStatus,
        selectedNumbers, // ✅ Provide selected numbers
        setSelectedNumbers, // ✅ Provide setter function
        refreshGameState: fetchGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// ✅ Custom Hook to Access Game Data
export const useGame = () => useContext(GameContext);
