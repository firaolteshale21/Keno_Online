import { useState } from "react";
import { placeBet } from "../services/api"; // ✅ Import API function

const GameControls = ({
  gameRoundId,
  selectedNumbers,
  userToken,
  gameStatus,
}) => {
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Function to place a bet
  const handleBet = async () => {
    console.log("Sending bet request with:", {
      gameRoundId,
      selectedNumbers,
      betAmount,
    });

    if (!betAmount || betAmount <= 0) {
      setMessage({ text: "Please enter a valid bet amount.", type: "error" });
      return;
    }
    if (!selectedNumbers.length) {
      setMessage({ text: "Please select at least one number.", type: "error" });
      return;
    }
    console.log("🔥 Received gameStatus in GameControls:", gameStatus);


    if (gameStatus !== "betting") {
      setMessage({
        text: "Betting is closed. Please wait for the next round.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await placeBet(
        userToken,
        gameRoundId,
        selectedNumbers,
        betAmount
      );
      setMessage({ text: response.message, type: "success" });
      setBetAmount("");
    } catch (error) {
      setMessage({ text: String(error), type: "error" });
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
            className="w-32 px-2 py-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter amount"
            disabled={gameStatus !== "betting"} // ✅ Disable input when betting is closed
          />
          <button
            onClick={handleBet}
            disabled={loading || gameStatus !== "betting"} // ✅ Disable bet button when betting is closed
            className={`px-4 py-2 font-bold rounded-lg h-10 ${
              gameStatus !== "betting"
                ? "bg-gray-500"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? "Processing..." : "BET"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default GameControls;
