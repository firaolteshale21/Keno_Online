import { useState } from "react";
import UserBetsTracker from "./UserBetsTracker";

const RightSectionTabs = ({ drawnNumbers }) => {
  const [activeTab, setActiveTab] = useState("bets");

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("bets")}
          className={`flex-1 py-2 text-sm sm:text-base rounded-md transition-all ${
            activeTab === "bets"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Bets
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`flex-1 py-2 text-sm sm:text-base rounded-md transition-all ${
            activeTab === "results"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Results
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2 text-sm sm:text-base rounded-md transition-all ${
            activeTab === "stats"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Stats
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 text-gray-300 p-3 rounded-md shadow-inner h-40 flex items-center justify-center border border-gray-700">
        {activeTab === "bets" ? (
          <UserBetsTracker drawnNumbers={drawnNumbers} />
        ) : activeTab === "results" ? (
          <p className="text-center">Results Tab Content (Coming Soon)</p>
        ) : (
          <p className="text-center">Stats Tab Content (Coming Soon)</p>
        )}
      </div>
    </div>
  );
};

export default RightSectionTabs;
