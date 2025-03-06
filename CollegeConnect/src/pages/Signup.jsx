import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "", // Confirmation password
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.1.5:8000/accounts/register/",
        formData
      );
      console.log(response.data);

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container signup-form-container">
        <h2 className="auth-heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
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
          <div className="form-group">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
