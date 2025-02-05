import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    dateOfBirth: "",
    otp: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate inputs
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.dateOfBirth
    ) {
      setError("All fields except OTP are required!");
      return;
    }
    // Handle form submission logic here (e.g., send data to the backend)
    console.log("Registration Data:", formData);
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-bold mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-bold mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-bold mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-bold mb-1">
            OTP (optional)
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
