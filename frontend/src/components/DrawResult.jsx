import { useEffect, useState } from "react";
import socket from "../socket";

const DrawResult = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    // ✅ Fetch previous drawn numbers when a player joins or refreshes
    socket.on("currentGameState", (data) => {
      setAnimatedNumbers(data.drawnNumbers || []);
    });

    // ✅ Listen for new round events
    socket.on("newRound", () => {
      setAnimatedNumbers([]);
      setDisplayMessage("Place your bets!");
    });

    // ✅ Listen for drawn numbers
    socket.on("drawNumber", (data) => {
      setDisplayMessage(data.message);
      setAnimatedNumbers(data.drawnSoFar);
    });

    // ✅ Listen for round completion
    socket.on("roundComplete", () => {
      setDisplayMessage("Round Complete!");
      setTimeout(() => {
        setAnimatedNumbers([]);
        setDisplayMessage("Place your bets!");
      }, 5000);
    });

    return () => {
      socket.off("currentGameState");
      socket.off("newRound");
      socket.off("drawNumber");
      socket.off("roundComplete");
    };
  }, []);

  return (
    <div className="w-full max-w-xl flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md border-2 border-gray-600">
      <p className="text-xl font-bold mb-2">{displayMessage}</p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold border-2 
              ${
                animatedNumbers[i]
                  ? "bg-yellow-500 border-yellow-600 text-gray-900"
                  : "border-gray-600"
              }`}
          >
            {animatedNumbers[i] || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawResult;
