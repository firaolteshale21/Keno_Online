import { useState } from "react";
import { placeBet } from "../services/api"; // ✅ Import API function

const GameControls = ({ gameRoundId, selectedNumbers, userToken }) => {
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // ✅ Ensure message is always a string

  // ✅ Function to place a bet
  const handleBet = async () => {
    //adding a debugging message
    console.log("Sending bet request with:");
    console.log("Game Round ID:", gameRoundId);
    console.log("Selected Numbers:", selectedNumbers);
    console.log("Bet Amount:", betAmount);

    if (!betAmount || betAmount <= 0) {
      setMessage("Please enter a valid bet amount.");
      return;
    }
    if (!selectedNumbers.length) {
      setMessage("Please select at least one number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await placeBet(
        userToken,
        gameRoundId,
        selectedNumbers,
        betAmount
      );
      setMessage(response.message); // ✅ Show success message
      setBetAmount(""); // ✅ Reset bet amount after success
    } catch (error) {
      setMessage(String(error)); // ✅ Ensure error is converted to a string
    } finally {
      setLoading(false);
    }
  };

  // ✅ Quick Amount Buttons
  const handleQuickAmount = (amount) => {
    setBetAmount(amount.toString());
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="flex flex-col items-center w-full max-w-4xl px-4">
        {/* ✅ Display Success/Error Messages */}
        {message && (
          <p className="text-center text-white bg-gray-700 p-2 rounded-md mb-2">
            {String(message)}{" "}
            {/* ✅ Convert to string to avoid object rendering error */}
          </p>
        )}

        {/* Bet Amount Input and Buttons */}
        <div className="flex flex-col sm:flex-row items-center mb-3 w-full">
          <div className="flex flex-col items-start mb-4 sm:mb-0 sm:mr-4">
            <label
              htmlFor="betAmount"
              className="text-white text-sm font-bold mb-1"
            >
              Bet Amount:
            </label>
            <input
              id="betAmount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-32 px-2 py-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter amount"
            />
          </div>

          {/* BET, CLEAR, AUTO Buttons */}
          <div className="flex gap-2 sm:gap-4 sm:mt-5">
            <button
              onClick={handleBet}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg h-10 hover:bg-green-700 disabled:bg-gray-500"
            >
              {loading ? "Processing..." : "BET"}
            </button>
            <button
              onClick={() => setBetAmount("")}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg h-10 hover:bg-blue-700"
            >
              CLEAR
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg h-10 hover:bg-gray-700">
              AUTO
            </button>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center w-full">
          {[10, 50, 250, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAmount(amount)}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 w-20 h-10"
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameControls;
