import { useUser } from "../context/UserContext";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";

const GameNavBar = () => {
  const { user, loading } = useUser();

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-10 flex items-center justify-between px-4 py-2 h-11">
      {/* 🔥 FIXED HEIGHT: `h-16` to prevent extra space */}

      {/* ✅ Game Brand/Logo */}
      <div className="text-teal-400 text-lg font-bold sm:text-xl">SBET</div>

      {/* ✅ User Info Section */}
      <div className="flex items-center gap-3 sm:gap-6">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            {/* ✅ Balance Display */}
            <div className="text-white text-sm sm:text-lg font-semibold">
              ETB{" "}
              <span className="text-yellow-400">
                {user.balance?.toFixed(2) ?? "0.00"}
              </span>
            </div>

            {/* ✅ Deposit Button */}
            <button className="px-3 py-1 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 text-xs sm:text-sm">
              Deposit
            </button>

            {/* ✅ Username */}
            <div className="text-xs sm:text-sm">
              User:{" "}
              <span className="font-bold text-yellow-400">
                {user.firstName}
              </span>
            </div>

            {/* ✅ Message Icon */}
            <FaEnvelope className="text-lg sm:text-2xl cursor-pointer hover:text-yellow-400" />

            {/* ✅ Profile Icon */}
            <FaUserCircle className="text-lg sm:text-2xl cursor-pointer hover:text-yellow-400" />
          </>
        ) : (
          <span className="text-red-500">User not found</span>
        )}
      </div>
    </div>
  );
};

export default GameNavBar;
