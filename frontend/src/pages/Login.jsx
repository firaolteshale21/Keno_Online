import { useState } from "react";
import { loginUser } from "../services/api"; // ✅ Import login API
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import { useNavigate } from "react-router-dom"; // ✅ Navigation

const Login = () => {
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [error, setError] = useState(""); // ✅ Handle error messages
  const { setUser } = useUser(); // ✅ Get setUser from User Context
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // ✅ Clear previous errors

    try {
      const data = await loginUser(formData.phoneNumber, formData.password);
      console.log("✅ Login Successful:", data);

      // ✅ Store token in local storage
      localStorage.setItem("token", data.token);

      // ✅ Update global user state
      setUser(data.user);

      // ✅ Redirect user to game page
      navigate("/game");
    } catch (errorMessage) {
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-bold mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-bold mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
