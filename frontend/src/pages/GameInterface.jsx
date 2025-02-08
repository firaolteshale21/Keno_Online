import { useState, useEffect } from "react";
import NumberGrid from "../components/NumberGrid";
import Timer from "../components/Timer";
import DrawResult from "../components/DrawResult";
import GameControls from "../components/GameControls";
import GameNavBar from "../components/GameNavBar";
import UserBetsTracker from "../components/UserBetsTracker";
import { useGame } from "../context/GameContext"; // ✅ Import Game Context
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import socket from "../socket";

function GameInterface() {
  const { gameRoundId, gameStatus } = useGame(); // ✅ Fetch game state from context
  const { user } = useUser(); // ✅ Fetch user data from context
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [phaseMessage, setPhaseMessage] = useState("Place your bets!");

  useEffect(() => {
    // ✅ Listen for number draws
    socket.on("drawNumber", (data) => {
      setDrawnNumbers(data.drawnSoFar);
      setPhaseMessage(data.message);
    });

    // ✅ Listen for round completion
    socket.on("roundComplete", () => {
      setPhaseMessage("Round Complete!");
    });

    // ✅ Cleanup socket listeners
    return () => {
      socket.off("drawNumber");
      socket.off("roundComplete");
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* ✅ Top Navigation Bar */}
      <GameNavBar />

      {/* ✅ Main Layout Grid */}
      <div className="flex flex-grow w-full">
        {/* ✅ Left Sidebar - Player Bets */}
        <aside className="hidden md:flex w-1/5 bg-gray-800 p-3 overflow-y-auto"></aside>

        {/* ✅ Center Section */}
        <main className="flex flex-col flex-grow items-center max-w-4xl w-full p-3">
          <DrawResult drawnNumbers={drawnNumbers} />
          <Timer />
          <NumberGrid onSelect={setSelectedNumbers} />
          <GameControls
            gameRoundId={gameRoundId}
            selectedNumbers={selectedNumbers}
            userToken={user?.token} // ✅ Ensure token is passed
            gameStatus={gameStatus}
          />
        </main>

        {/* ✅ Right Sidebar - Placeholder for Future Features */}
        <aside className="hidden md:flex w-1/4 bg-gray-800 p-3 overflow-y-auto">
          <div className="text-center text-gray-400">
            <UserBetsTracker drawnNumbers={drawnNumbers} />
            <p>Statistics & Leaderboard (Coming Soon)</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default GameInterface;
