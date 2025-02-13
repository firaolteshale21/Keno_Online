import { useState, useEffect } from "react";
import socket from "../socket";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Waiting...");
  const [color, setColor] = useState("bg-gray-600");

  useEffect(() => {
    socket.on("timerUpdate", (data) => {
      setTimeLeft(data.timeLeft);
      setStatusMessage(data.message);

      if (data.phase === "countdown") setColor("bg-blue-500");
      else if (data.phase === "betting") setColor("bg-green-600");
      else if (data.phase === "drawing") setColor("bg-red-500");
      else if (data.phase === "nextRound") setColor("bg-purple-500");
    });

    return () => {
      socket.off("timerUpdate");
    };
  }, []);

  return (
    <div
      className={`text-center text-base sm:text-lg font-semibold text-white ${color} px-2 py-1 rounded-md`}
    >
      {statusMessage} {timeLeft !== null ? `${timeLeft}` : ""}
    </div>
  );
};

export default Timer;
