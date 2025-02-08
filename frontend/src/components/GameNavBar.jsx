import { useUser } from "../context/UserContext"; // ✅ Use UserContext
import { FaEnvelope, FaUserCircle } from "react-icons/fa";

const GameNavBar = () => {
  const { user, loading } = useUser(); // ✅ Fetch balance from context

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-10 flex flex-col sm:flex-row items-center justify-between px-4 py-3">
      <div className="text-teal-400 text-lg font-bold sm:text-xl">Holder</div>

      <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0 sm:gap-6">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <div className="text-white text-sm sm:text-lg font-semibold">
              ETB{" "}
              <span className="text-yellow-400">
                {user.balance?.toFixed(2) ?? "0.00"} {/* ✅ Always a number */}
              </span>
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
