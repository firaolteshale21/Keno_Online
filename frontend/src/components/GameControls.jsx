import { useState } from "react";
import { placeBet } from "../services/api";
import socket from "../socket";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";

const GameControls = () => {
  const { gameRoundId, gameStatus, selectedNumbers } = useGame();
  const { user, token } = useUser();
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Paytable for calculating possible winnings
  const Paytable = {
    1: { 1: 3 },
    2: { 1: 1, 2: 5 },
    3: { 2: 2, 3: 10 },
    4: { 2: 1, 3: 5, 4: 20 },
    5: { 2: 1, 3: 3, 4: 15, 5: 50 },
    6: { 3: 2, 4: 10, 5: 50, 6: 300 },
    7: { 3: 3, 4: 15, 5: 150, 6: 750, 7: 1500 },
    8: { 4: 4, 5: 20, 6: 100, 7: 1000, 8: 3000 },
  };

  // ✅ Function to calculate possible winnings
  const calculatePossibleWinnings = (selectedCount, betAmount) => {
    if (!Paytable[selectedCount]) return 0;
    let maxMultiplier = Math.max(...Object.values(Paytable[selectedCount]));
    return betAmount * maxMultiplier;
  };

  const handleBet = async () => {
    console.log("Sending bet request with:", {
      gameRoundId,
      selectedNumbers,
      betAmount,
    });

    if (!token) {
      setMessage({
        text: "User is not authenticated. Please log in.",
        type: "error",
      });
      return;
    }

    if (!betAmount || betAmount <= 0) {
      setMessage({ text: "Please enter a valid bet amount.", type: "error" });
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (!selectedNumbers || selectedNumbers.length === 0) {
      setMessage({ text: "Please select at least one number.", type: "error" });
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (gameStatus !== "betting") {
      setMessage({
        text: "Betting is closed. Please wait for the next round.",
        type: "error",
      });
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await placeBet(gameRoundId, selectedNumbers, betAmount);

      console.log("✅ Emitting newBetPlaced event:", {
        betId: response.bet.id,
        selectedNumbers,
        possibleWinningAmount: calculatePossibleWinnings(
          selectedNumbers.length,
          betAmount
        ),
        actualWinningAmount: 0,
      });

      // ✅ Emit new bet event to WebSocket
      socket.emit("newBetPlaced", {
        betId: response.bet.id,
        selectedNumbers,
        possibleWinningAmount: calculatePossibleWinnings(
          selectedNumbers.length,
          betAmount
        ),
        actualWinningAmount: 0,
      });

      setMessage({ text: response.message, type: "success" });
      setBetAmount("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({ text: String(error), type: "error" });
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="flex flex-col items-center w-full max-w-4xl px-4">
        {message && (
          <p
            className={`text-center p-2 rounded-md mb-2 ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center mb-3 w-full">
          <input
            id="betAmount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full sm:w-32 px-2 py-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter amount"
            disabled={gameStatus !== "betting"}
          />
          <button
            onClick={handleBet}
            disabled={loading || gameStatus !== "betting"}
            className="w-full sm:w-auto px-3 py-1.5 font-bold rounded-lg h-10 mt-2 sm:mt-0 sm:ml-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Processing..." : "BET"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
