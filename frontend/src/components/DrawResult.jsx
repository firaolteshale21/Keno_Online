const DrawResult = ({ drawnNumbers, phaseMessage }) => {
  return (
    <div className="w-full max-w-xl flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md border border-gray-600">
      <p className="text-lg sm:text-xl font-bold mb-4">{phaseMessage}</p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 w-full justify-center">
        {drawnNumbers.map((number, index) => (
          <div
            key={index}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold border-2 transition-all ${
              number
                ? "bg-yellow-500 border-yellow-600 text-gray-900"
                : "border-gray-600 bg-gray-700 text-gray-300"
            }`}
          >
            {number || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawResult;
