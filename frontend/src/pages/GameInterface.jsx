import { useState, useEffect } from "react";
import NumberGrid from "../components/NumberGrid";
import Timer from "../components/Timer";
import DrawResult from "../components/DrawResult";
import GameControls from "../components/GameControls";
import GameNavBar from "../components/GameNavBar";
import GameTabs from "../components/GameTabs";
import RightSectionTabs from "../components/RightSectionTabs";
import LeftSectionTabs from "../components/LeftSectionTabs";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import socket from "../socket";

function GameInterface() {
  const { gameRoundId, gameStatus } = useGame();
  const { user } = useUser();
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [phaseMessage, setPhaseMessage] = useState("Choose Up to 8 Numbers!");

  useEffect(() => {
    const handleDrawNumber = (data) => {
      setDrawnNumbers(data.drawnSoFar);
      setPhaseMessage(data.message);
    };

    const handleRoundComplete = () => {
      setPhaseMessage("Round Complete!");

      // ✅ Clear numbers after 5 seconds
      setTimeout(() => {
        setDrawnNumbers([]);
        setPhaseMessage("Choose Up to 8 Numbers!");
      }, 5000);
    };

    const handleCurrentGameState = (data) => {
      if (data.drawnNumbers && data.drawnNumbers.length > 0) {
        setDrawnNumbers(data.drawnNumbers);
      }
    };
    const handleNewRoundID = (data) => {
      setPhaseMessage(data.message);
      localStorage.setItem("gameRoundId", data.gameRoundId);
      localStorage.removeItem("userBets"); // ✅ Clear old bets when a new round starts
    };


    socket.on("drawNumber", handleDrawNumber);
    socket.on("roundComplete", handleRoundComplete);
    socket.on("currentGameState", handleCurrentGameState);
    socket.on("newRoundID", handleNewRoundID);

    return () => {
      socket.off("drawNumber", handleDrawNumber);
      socket.off("roundComplete", handleRoundComplete);
      socket.off("currentGameState", handleCurrentGameState);
      socket.off("newRoundID", handleNewRoundID);
    };
  }, []);
  useEffect(() => {
    const handleNewRoundID = (data) => {
      setPhaseMessage(data.message);
      localStorage.setItem("gameRoundId", data.gameRoundId);
      localStorage.removeItem("userBets"); // ✅ Clear old bets when a new round starts
    };

    socket.on("newRoundID", handleNewRoundID);

    return () => {
      socket.off("newRoundID", handleNewRoundID);
    };
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden">
      <GameNavBar />

      {/* ✅ Main Layout Grid */}
      <div className="flex flex-grow w-full max-h-screen">
        <aside className="hidden md:flex w-1/4 bg-gray-800 p-3 overflow-y-auto border-r border-gray-700">
          <LeftSectionTabs />
        </aside>

        <main className="flex flex-col flex-grow items-center justify-center p-4 space-y-4">
          <Timer />
          <DrawResult drawnNumbers={drawnNumbers} phaseMessage={phaseMessage} />
          <NumberGrid onSelect={setSelectedNumbers} />
          <GameControls
            gameRoundId={gameRoundId}
            selectedNumbers={selectedNumbers}
            userToken={user?.token}
            gameStatus={gameStatus}
          />
        </main>

        <aside className="hidden md:flex w-1/4 bg-gray-800 p-3 overflow-y-auto border-l border-gray-700">
          <RightSectionTabs drawnNumbers={drawnNumbers} />
        </aside>
      </div>

      <div className="md:hidden w-full p-3">
        <GameTabs drawnNumbers={drawnNumbers} />
      </div>
    </div>
  );
}

export default GameInterface;
