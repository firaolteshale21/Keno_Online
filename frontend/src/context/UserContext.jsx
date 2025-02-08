import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserData } from "../services/api";
import socket from "../socket";

// ✅ Create User Context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Function to fetch user data ONCE
  const getUserDetails = async () => {
    if (!token) {
      console.warn("No authentication token found.");
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserData();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      localStorage.removeItem("token"); // Clear invalid token
      setToken(null);
      setError("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user data once when the component mounts
  useEffect(() => {
    getUserDetails();
  }, []);

  // ✅ Listen for balance updates ONLY from WebSockets
  useEffect(() => {
    if (!user?.id) return;

    const handleBalanceUpdate = (data) => {
      if (data.userId === user.id) {
        console.log("🔄 Balance updated via WebSocket:", data.newBalance);
        setUser((prevUser) => ({
          ...prevUser,
          balance: parseFloat(data.newBalance) || 0,
        }));
      }
    };

    socket.on("balanceUpdated", handleBalanceUpdate);

    return () => {
      socket.off("balanceUpdated", handleBalanceUpdate);
    };
  }, [user?.id]);

  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, loading, error }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook to Access User Data
export const useUser = () => useContext(UserContext);
