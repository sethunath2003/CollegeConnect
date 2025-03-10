import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Show loading screen when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading while API call is in progress

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        formData
      );
      console.log(response.data);

      if (response.status === 200) {
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: response.data.username,
            userId: response.data.user_id,
          })
        );
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Login failed", error);
      setLoading(false); // Hide loading on error
    }
  };

  if (loading) {
    return <LoadingScreen message="Preparing login..." />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
