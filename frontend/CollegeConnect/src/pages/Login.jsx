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
    <div className="auth-container">
      <div className="auth-form-container login-form-container">
        <h2 className="auth-heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <div className="form-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="form-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
