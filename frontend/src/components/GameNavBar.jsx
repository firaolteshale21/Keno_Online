import { useState, useEffect } from "react";
import { fetchUserData } from "../services/api";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import socket from "../socket"; // ✅ Import WebSocket

const GameNavBar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  // ✅ Function to fetch user balance
  const getUserDetails = async () => {
    try {
      const userData = await fetchUserData();

      // ✅ Ensure balance is a number
      const safeBalance = parseFloat(userData.balance) || 0;
      setUser({ ...userData, balance: safeBalance });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user details."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails(); // ✅ Fetch balance initially
  }, []);

  useEffect(() => {
    const handleBalanceUpdate = (data) => {
      if (user && user.id === data.userId) {
        console.log("🔄 Balance updated:", data.newBalance);
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, balance: parseFloat(data.newBalance) || 0 }
            : prevUser
        );
      }
    };

    socket.on("balanceUpdated", handleBalanceUpdate);

    return () => {
      socket.off("balanceUpdated", handleBalanceUpdate);
    };
  }, [user?.id]); // Keep this effect only for balance updates

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-10 flex flex-col sm:flex-row items-center justify-between px-4 py-3">
      {/* Left Section */}
      <div className="text-teal-400 text-lg font-bold sm:text-xl">Holder</div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0 sm:gap-6">
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : user ? (
          <>
            <div className="text-white text-sm sm:text-lg font-semibold">
              ETB{" "}
              <span className="text-yellow-400">{user.balance.toFixed(2)}</span>
            </div>
            <button className="px-2 py-1 bg-green-600 text-white font-bold rounded hover:bg-green-500">
              Deposit
            </button>
            <div className="text-xs sm:text-sm">
              User:{" "}
              <span className="font-bold text-yellow-400">
                {user.firstName}
              </span>
            </div>
            <FaEnvelope className="text-lg cursor-pointer hover:text-yellow-400" />
            <FaUserCircle className="text-xl sm:text-2xl cursor-pointer hover:text-yellow-400" />
          </>
        ) : (
          <span className="text-red-500">User not found</span>
        )}
      </div>
    </div>
  );
};

export default GameNavBar;
