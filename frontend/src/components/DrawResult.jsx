import { useEffect, useState } from "react";
import socket from "../socket";

const DrawResult = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    // ✅ Fetch previous drawn numbers when a player joins or refreshes
    const handleCurrentGameState = (data) => {
      setAnimatedNumbers(data.drawnNumbers || []);
    };

    // ✅ Listen for new round events
    const handleNewRound = () => {
      setAnimatedNumbers([]);
      setDisplayMessage("Place your bets!");
    };

    // ✅ Listen for drawn numbers
    const handleDrawNumber = (data) => {
      setDisplayMessage(data.message);
      setAnimatedNumbers(data.drawnSoFar);
    };

    // ✅ Listen for round completion
    const handleRoundComplete = () => {
      setDisplayMessage("Round Complete!");
      setTimeout(() => {
        setAnimatedNumbers([]);
        setDisplayMessage("Place your bets!");
      }, 5000);
    };

    // Register socket listeners
    socket.on("currentGameState", handleCurrentGameState);
    socket.on("newRound", handleNewRound);
    socket.on("drawNumber", handleDrawNumber);
    socket.on("roundComplete", handleRoundComplete);

    // Cleanup socket listeners
    return () => {
      socket.off("currentGameState", handleCurrentGameState);
      socket.off("newRound", handleNewRound);
      socket.off("drawNumber", handleDrawNumber);
      socket.off("roundComplete", handleRoundComplete);
    };
  }, []);

  return (
    <div className="w-full max-w-xl flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md border-2 border-gray-600">
      <p className="text-xl font-bold mb-2">{displayMessage}</p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
        {animatedNumbers.map((number, index) => (
          <div
            key={index}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold border-2 
              ${
                number
                  ? "bg-yellow-500 border-yellow-600 text-gray-900"
                  : "border-gray-600"
              }`}
          >
            {number || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawResult;
