import axios from "axios";

// Base URL for your backend (update if needed)
const API_BASE_URL = "http://localhost:5000/api";

// Axios instance for API requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// User Login API
export const loginUser = async (phoneNumber, password) => {
  try {
    const response = await api.post("auth/login", { phoneNumber, password });
    return response.data; // Returns token and user data
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

// User Registration API
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Registration failed";
  }
};

// Verify OTP
export const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const response = await api.post("/verify-otp", { phoneNumber, otpCode });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "OTP Verification failed";
  }
};

// Fetch user data (protected route)
export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await api.get("auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Check if the response contains data
    if (response && response.data) {
      // Ensure balance is a number
      if (typeof response.data.balance === "string") {
        response.data.balance = parseFloat(response.data.balance);
      }
      return response.data;
    } else {
      throw new Error("No user data found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error); // Log the error for debugging
    throw error.response?.data?.error || "Failed to fetch user data";
  }  
};

// ✅ Function to place a bet
export const placeBet = async (token, gameRoundId, selectedNumbers, amount) => {
  if (!token) {
    throw new Error("User is not authenticated."); // ✅ Prevents API call without a token
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/game/place-bet`,
      { gameRoundId, selectedNumbers, amount },
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Sends token in request headers
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Bet placement failed.";
  }
};




export default api;
