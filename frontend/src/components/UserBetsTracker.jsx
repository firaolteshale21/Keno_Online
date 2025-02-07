import { useEffect, useState } from "react";
import socket from "../socket";

const UserBetsTracker = () => {
  const [bets, setBets] = useState([]);
  const [totalPossibleWinnings, setTotalPossibleWinnings] = useState(0);
  const [totalActualWinnings, setTotalActualWinnings] = useState(null); // Null initially
  const [showFinalTotal, setShowFinalTotal] = useState(false); // ✅ Control visibility

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
      console.log("🔄 Round completed, calculating total actual winnings...");
      const newTotal = bets.reduce(
        (sum, bet) => sum + parseFloat(bet.actualWinningAmount || 0),
        0
      );

      setTotalActualWinnings(newTotal);
      setShowFinalTotal(true); // ✅ Show final total for 5 seconds

      // ✅ Reset actual winnings display after 5 seconds
      setTimeout(() => {
        setShowFinalTotal(false);
      }, 5000);
    });

    return () => {
      socket.off("newBetPlaced");
      socket.off("betResultUpdated");
      socket.off("roundComplete");
    };
  }, [bets]);

  // ✅ Calculate total possible winnings dynamically before round completion
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
                CN
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
                <td className="border border-gray-600 px-2 py-1 text-center text-sm whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center text-sm whitespace-nowrap">
                  {bet.selectedNumbers.join(", ")}
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center text-sm whitespace-nowrap">
                  ${bet.possibleWinningAmount.toFixed(2)}
                </td>
                <td className="border border-gray-600 px-2 py-1 text-center text-sm text-yellow-400 whitespace-nowrap">
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
