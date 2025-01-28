import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token"); // Remove the JWT token
      navigate("/login"); // Redirect to the login page after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
