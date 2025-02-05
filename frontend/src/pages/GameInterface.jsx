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

  useEffect(() => {
    // ✅ Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setUserToken(token);
    } else {
      console.warn("No authentication token found!");
    }

    // Socket event listeners
    socket.on("drawNumber", (data) => {
      setDrawnNumbers(data.drawnSoFar);
      setPhaseMessage(data.message); // Update phase message
    });

    socket.on("newRoundID", (data) => {
      console.log("New round started. Received gameRoundId:", data.gameRoundId);
      setDrawnNumbers([]);
      setGameRoundId(data.gameRoundId); // ✅ Store gameRoundId
      setPhaseMessage("Place your bets!"); // Reset phase message
    });

    socket.on("balanceUpdated", (data) => {
      console.log("🔄 Balance updated in GameInterface:", data);
    });

    socket.on("roundComplete", () => {
      setPhaseMessage("Round Complete!"); // Update phase message
    });

    socket.on("activeGameRound", (data) => {
      console.log("🔄 Received active gameRoundId:", data.gameRoundId);
      if (data.gameRoundId) {
        setGameRoundId(data.gameRoundId);
      }
    });

    // Cleanup socket listeners
    return () => {
      socket.off("drawNumber");
      socket.off("newRound");
      socket.off("balanceUpdated");
      socket.off("roundComplete");
      socket.off("activeGameRound");
    };
  }, []);

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
        />

        {/* Display phase message */}
        <div className="text-lg font-semibold mt-4">{phaseMessage}</div>
      </div>
    </div>
  );
}

export default GameInterface;
