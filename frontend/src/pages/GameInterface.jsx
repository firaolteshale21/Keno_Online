import { useState, useEffect } from "react";
import NumberGrid from "../components/NumberGrid";
import Timer from "../components/Timer";
import DrawResult from "../components/DrawResult";
import GameControls from "../components/GameControls";
import GameNavBar from "../components/GameNavBar";
import socket from "../socket";

function GameInterface() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [gameRoundId, setGameRoundId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [phaseMessage, setPhaseMessage] = useState("Place your bets!");
  const [gameStatus, setGameStatus] = useState("betting");

  useEffect(() => {
    // ✅ Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setUserToken(token);
    } else {
      console.warn("No authentication token found!");
    }

    // Socket event listeners
    const handleDrawNumber = (data) => {
      setDrawnNumbers(data.drawnSoFar);
      setPhaseMessage(data.message); // Update phase message
    };

    const handleNewRoundID = (data) => {
      console.log("New round started. Received gameRoundId:", data.gameRoundId);
      setDrawnNumbers([]);
      setGameRoundId(data.gameRoundId); // ✅ Store gameRoundId
      setPhaseMessage("Place your bets!"); // Reset phase message
    };

    const handleBalanceUpdate = (data) => {
      console.log("🔄 Balance updated in GameInterface:", data);
    };

    const handleRoundComplete = () => {
      setPhaseMessage("Round Complete!"); // Update phase message
    };

    const handleActiveGameRound = (data) => {
      console.log("🔄 Received active gameRoundId:", data.gameRoundId);
      if (data.gameRoundId) {
        setGameRoundId(data.gameRoundId);
      }
    };

    const handleCurrentGameState = (data) => {
      console.log("🔄 Received current game state:", data);
      setGameStatus(data.gameStatus); // ✅ Set game status
      setGameRoundId(data.gameRoundId); // ✅ Set game round ID
    };

    const handleGameStatus = (data) => {
      console.log("Game Status Updated from Backend:", data.status); // ✅ Log status from backend
      setGameStatus(data.status);
    };

    // Registering socket listeners
    socket.on("drawNumber", handleDrawNumber);
    socket.on("newRoundID", handleNewRoundID);
    socket.on("balanceUpdated", handleBalanceUpdate);
    socket.on("roundComplete", handleRoundComplete);
    socket.on("activeGameRound", handleActiveGameRound);
    socket.on("currentGameState", handleCurrentGameState);
    socket.on("gameStatus", handleGameStatus);

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("drawNumber", handleDrawNumber);
      socket.off("newRoundID", handleNewRoundID);
      socket.off("balanceUpdated", handleBalanceUpdate);
      socket.off("roundComplete", handleRoundComplete);
      socket.off("activeGameRound", handleActiveGameRound);
      socket.off("currentGameState", handleCurrentGameState);
      socket.off("gameStatus", handleGameStatus);
    };
  }, []); // Only run on mount and unmount

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-4 py-6">
      <GameNavBar />

      <div className="w-full max-w-4xl flex flex-col items-center space-y-2">
        <DrawResult drawnNumbers={drawnNumbers} />

        <Timer />

        <NumberGrid onSelect={setSelectedNumbers} />

        <GameControls
          gameRoundId={gameRoundId}
          selectedNumbers={selectedNumbers}
          userToken={userToken}
          gameStatus={gameStatus} // ✅ Pass gameStatus to GameControls
        />

        {/* Display phase message */}
        <div className="text-lg font-semibold mt-4">{phaseMessage}</div>
      </div>
    </div>
  );
}

export default GameInterface;
