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


// ✅ Automatically add Authorization token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Fetch user data (protected route)
export const fetchUserData = async () => {
  try {
    const response = await api.get("auth/me");

    // ✅ Ensure balance is a valid number
    if (response.data && response.data.balance !== undefined) {
      response.data.balance = parseFloat(response.data.balance) || 0;
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch user data";
  }
};


// ✅ Place a bet
export const placeBet = async (gameRoundId, selectedNumbers, amount) => {
  try {
    const response = await api.post("/game/place-bet", {
      gameRoundId,
      selectedNumbers,
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Bet placement failed.";
  }
};

export default api;
