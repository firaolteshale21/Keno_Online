import { useState } from "react";
import UserBetsTracker from "../components/UserBetsTracker"; // ✅ Bets Section
import { FaUsers, FaClipboardList, FaChartBar, FaTrophy } from "react-icons/fa";

const GameTabs = ({ drawnNumbers }) => {
  const [activeTab, setActiveTab] = useState("Bets");

  return (
    <div className="w-full bg-gray-800 p-2 rounded-lg shadow-md">
      {/* ✅ Tab Navigation */}
      <div className="flex justify-around border-b-2 border-gray-600 pb-2">
        <button
          onClick={() => setActiveTab("Game")}
          className={`flex-1 text-center p-2 text-sm sm:text-base font-bold rounded-t-md ${
            activeTab === "Game"
              ? "bg-gray-700 text-yellow-400"
              : "text-gray-400"
          }`}
        >
          <FaUsers className="inline-block mr-1" /> Game
        </button>
        <button
          onClick={() => setActiveTab("Bets")}
          className={`flex-1 text-center p-2 text-sm sm:text-base font-bold rounded-t-md ${
            activeTab === "Bets"
              ? "bg-gray-700 text-yellow-400"
              : "text-gray-400"
          }`}
        >
          <FaClipboardList className="inline-block mr-1" /> Bets
        </button>
        <button
          onClick={() => setActiveTab("Results")}
          className={`flex-1 text-center p-2 text-sm sm:text-base font-bold rounded-t-md ${
            activeTab === "Results"
              ? "bg-gray-700 text-yellow-400"
              : "text-gray-400"
          }`}
        >
          <FaTrophy className="inline-block mr-1" /> Results
        </button>
        <button
          onClick={() => setActiveTab("Statistics")}
          className={`flex-1 text-center p-2 text-sm sm:text-base font-bold rounded-t-md ${
            activeTab === "Statistics"
              ? "bg-gray-700 text-yellow-400"
              : "text-gray-400"
          }`}
        >
          <FaChartBar className="inline-block mr-1" /> Stats
        </button>
      </div>

      {/* ✅ Tab Content */}
      <div className="bg-gray-700 p-4 rounded-b-lg mt-2 min-h-[100px]">
        {activeTab === "Game" && (
          <p className="text-center text-gray-300">
            🎮 Active Players (Coming Soon)
          </p>
        )}
        {activeTab === "Bets" && (
          <UserBetsTracker drawnNumbers={drawnNumbers} />
        )}
        {activeTab === "Results" && (
          <p className="text-center text-gray-300">
            🏆 Game Results (Coming Soon)
          </p>
        )}
        {activeTab === "Statistics" && (
          <p className="text-center text-gray-300">
            📊 Statistics (Coming Soon)
          </p>
        )}
      </div>
    </div>
  );
};

export default GameTabs;
