import { useEffect, useState } from "react";
import socket from "../socket";
import { useGame } from "../context/GameContext";

const UserBetsTracker = ({ drawnNumbers }) => {
  const { gameRoundId } = useGame(); // ✅ Get current round
  const [bets, setBets] = useState([]);
  const [highlightedNumbers, setHighlightedNumbers] = useState(new Set());

  // ✅ Load bets from localStorage when gameRoundId changes
  useEffect(() => {
    if (!gameRoundId) return; // ✅ Don't do anything if round ID is missing
    const savedBets = localStorage.getItem(`userBets_${gameRoundId}`);
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    } else {
      setBets([]); // ✅ If nothing is found, set empty
    }
  }, [gameRoundId]);

  // ✅ Listen for real-time updates (Only affect current round)
  useEffect(() => {
    const handleNewBet = (betData) => {
      setBets((prevBets) => [
        ...prevBets,
        { ...betData, actualWinningAmount: 0 },
      ]);
    };

    const handleBetResult = (updatedBet) => {
      setBets((prevBets) =>
        prevBets.map((bet) =>
          bet.betId === updatedBet.betId
            ? { ...bet, actualWinningAmount: updatedBet.actualWinningAmount }
            : bet
        )
      );
    };

    const handleRoundComplete = () => {
      const matchingNumbers = new Set(
        bets.flatMap((bet) =>
          bet.selectedNumbers.filter((num) => drawnNumbers.includes(num))
        )
      );
      setHighlightedNumbers(matchingNumbers);

      // ✅ Clear everything after 5 seconds
      setTimeout(() => {
        setBets([]);
        setHighlightedNumbers(new Set());
        localStorage.removeItem(`userBets_${gameRoundId}`);
      }, 5000);
    };

    const handleNewRound = () => {
      // ✅ Ensure fresh start visually, data will load from localStorage if needed
      setHighlightedNumbers(new Set());
    };

    socket.on("newBetPlaced", handleNewBet);
    socket.on("betResultUpdated", handleBetResult);
    socket.on("roundComplete", handleRoundComplete);
    socket.on("newRound", handleNewRound);

    return () => {
      socket.off("newBetPlaced", handleNewBet);
      socket.off("betResultUpdated", handleBetResult);
      socket.off("roundComplete", handleRoundComplete);
      socket.off("newRound", handleNewRound);
    };
  }, [bets, drawnNumbers, gameRoundId]);

  return (
    <div className="w-full max-w-4xl mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-white text-lg font-bold text-center mb-3">
        Your Bets
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 text-white">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-2 py-1 text-sm whitespace-nowrap">
                No.
              </th>
              <th className="border border-gray-600 px-2 py-1 text-sm whitespace-nowrap">
                Chosen Numbers
              </th>
              <th className="border border-gray-600 px-2 py-1 text-sm whitespace-nowrap">
                PW
              </th>
              <th className="border border-gray-600 px-2 py-1 text-sm whitespace-nowrap">
                Win
              </th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet, index) => (
              <tr key={bet.betId} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="border border-gray-600 px-2 py-1 text-center text-sm">
                  {index + 1}
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bet.selectedNumbers.map((num) => (
                      <div
                        key={num}
                        className={`w-6 h-6 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                          highlightedNumbers.has(num)
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center text-sm">
                  ${bet.possibleWinningAmount.toFixed(2)}
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center text-sm text-yellow-400">
                  {bet.actualWinningAmount > 0
                    ? `$${bet.actualWinningAmount}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBetsTracker;
