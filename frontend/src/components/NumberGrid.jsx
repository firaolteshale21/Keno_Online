import { useGame } from "../context/GameContext"; // ✅ Use Game Context

const NumberGrid = () => {
  const { selectedNumbers, setSelectedNumbers } = useGame(); // ✅ Get from context

  const toggleNumber = (num) => {
    let updatedNumbers = [...selectedNumbers];
    if (updatedNumbers.includes(num)) {
      updatedNumbers = updatedNumbers.filter((n) => n !== num);
    } else if (updatedNumbers.length < 8) {
      updatedNumbers.push(num);
    }
    setSelectedNumbers(updatedNumbers); // ✅ Update context
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mt-4">
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
        {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-sm font-bold ${
              selectedNumbers.includes(num)
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => toggleNumber(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGrid;
