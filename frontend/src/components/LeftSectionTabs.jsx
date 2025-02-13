import { useState } from "react";

const LeftSectionTabs = () => {
  const [activeTab, setActiveTab] = useState("game");

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("game")}
          className={`flex-1 py-2 text-sm sm:text-base rounded-md transition-all ${
            activeTab === "game"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Game
        </button>

        <button
          onClick={() => setActiveTab("winners")}
          className={`flex-1 py-2 text-sm sm:text-base rounded-md transition-all ${
            activeTab === "winners"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Winners
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 text-gray-300 p-3 rounded-md shadow-inner h-40 flex items-center justify-center border border-gray-700">
        {activeTab === "game" ? (
          <p className="text-center">Game Tab Content (Coming Soon)</p>
        ) : (
          <p className="text-center">Winners Tab Content (Coming Soon)</p>
        )}
      </div>
    </div>
  );
};

export default LeftSectionTabs;
