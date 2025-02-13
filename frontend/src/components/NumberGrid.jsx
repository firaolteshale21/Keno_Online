import { useGame } from "../context/GameContext"; // ✅ Use Game Context

const NumberGrid = () => {
  const { selectedNumbers, setSelectedNumbers, gameStatus } = useGame(); // ✅ Get game status

  const toggleNumber = (num) => {
    if (gameStatus !== "betting") return; // ✅ Prevent selection during drawing phase

    let updatedNumbers = [...selectedNumbers];
    if (updatedNumbers.includes(num)) {
      updatedNumbers = updatedNumbers.filter((n) => n !== num);
    } else if (updatedNumbers.length < 8) {
      updatedNumbers.push(num);
    }
    setSelectedNumbers(updatedNumbers); // ✅ Update context
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg sm:max-w-4xl mt-0">
      {/* ✅ Fixed 10-column grid for all screen sizes */}
      <div className="grid grid-cols-10 gap-2 sm:gap-3">
        {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg text-xs sm:text-sm md:text-base font-bold transition-all
              ${
                selectedNumbers.includes(num)
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              } ${
              gameStatus !== "betting" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => toggleNumber(num)}
            disabled={gameStatus !== "betting"} // ✅ Disable during drawing phase
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGrid;
