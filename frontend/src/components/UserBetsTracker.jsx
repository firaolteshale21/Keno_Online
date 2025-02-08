import { useEffect, useState } from "react";
import socket from "../socket";

const UserBetsTracker = ({ drawnNumbers }) => {
  const [bets, setBets] = useState([]);
  const [totalPossibleWinnings, setTotalPossibleWinnings] = useState(0);
  const [totalActualWinnings, setTotalActualWinnings] = useState(null);
  const [showFinalTotal, setShowFinalTotal] = useState(false);
  const [highlightedBets, setHighlightedBets] = useState(new Set());

  useEffect(() => {
    socket.on("newBetPlaced", (betData) => {
      setBets((prevBets) => [
        ...prevBets,
        { ...betData, actualWinningAmount: 0 },
      ]);
    });

    socket.on("betResultUpdated", (updatedBet) => {
      setBets((prevBets) =>
        prevBets.map((bet) =>
          bet.betId === updatedBet.betId
            ? { ...bet, actualWinningAmount: updatedBet.actualWinningAmount }
            : bet
        )
      );
    });

    socket.on("roundComplete", () => {
      const newTotal = bets.reduce(
        (sum, bet) => sum + parseFloat(bet.actualWinningAmount || 0),
        0
      );

      setTotalActualWinnings(newTotal);
      setShowFinalTotal(true);
      highlightWinningNumbers();

      setTimeout(() => {
        setBets([]); // Clear the table after 5 seconds
      }, 5000);
    });

    return () => {
      socket.off("newBetPlaced");
      socket.off("betResultUpdated");
      socket.off("roundComplete");
    };
  }, [bets]);

  const highlightWinningNumbers = () => {
    const winningNumbers = new Set(drawnNumbers);

    bets.forEach((bet) => {
      bet.selectedNumbers.forEach((num) => {
        if (winningNumbers.has(num)) {
          highlightedBets.add(bet.betId);
        }
      });
    });

    setHighlightedBets(new Set(highlightedBets));

    setTimeout(() => {
      setHighlightedBets(new Set()); // Clear highlights after 5 seconds
    }, 5000);
  };

  useEffect(() => {
    setTotalPossibleWinnings(
      bets.reduce(
        (sum, bet) => sum + parseFloat(bet.possibleWinningAmount || 0),
        0
      )
    );
  }, [bets]);

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
                Chosen Number
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

                {/* Grid Layout for Chosen Numbers */}
                <td className="border border-gray-600 px-2 py-1 text-center">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bet.selectedNumbers.map((num) => (
                      <div
                        key={num}
                        className={`w-6 h-6 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-sm font-bold ${
                          highlightedBets.has(bet.betId) &&
                          drawnNumbers.includes(num)
                            ? "bg-green-500 text-white" // Highlight in green
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
