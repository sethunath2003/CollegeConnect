import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Start with false, only true during API call
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "", // Confirmation password
    full_name: "",
    department: "",
    year: "", // Default to year 1
  });
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  // Removed the initial loading effect (it was conflicting with the API call loading)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading during API call

    // Client-side validation *before* the API call
    if (formData.password !== formData.password2) {
      showPopup("Passwords do not match.", false);
      setLoading(false); // Hide loading after showing the error
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/register/",
        formData
      );

      if (response.status === 201) {
        showPopup("Signup successful! Redirecting...", true); // Show success popup
        // Delay the navigation slightly to allow the user to see the success message
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      // Handle different error scenarios gracefully
      let errorMessage = "Signup failed.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data) {
            // Check if the error response contains specific error messages
            if (error.response.data.username) {
                errorMessage = `Username: ${error.response.data.username[0]}`; // Get the first error message
            } else if (error.response.data.email) {
                 errorMessage = `Email: ${error.response.data.email[0]}`;
            } else if (error.response.data.password) {
                errorMessage = `Password: ${error.response.data.password[0]}`
            }
            else {
                //If the response has data but no specific keys, stringify the whole thing.
                 errorMessage = JSON.stringify(error.response.data);
            }
        } else {
           errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response received from the server.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = "An unexpected error occurred: " + error.message;
      }

      showPopup(errorMessage, false);
      setLoading(false); // Hide loading on error
    }
  };

  // --- Popup Functions ---
  const showPopup = (message, isSuccess) => {
    setPopup({ show: true, message, isSuccess });
    setTimeout(() => {
      setPopup({ ...popup, show: false });
    }, 2500); // Hide after 5 seconds
  };

  const hidePopup = () => { // Added a hide function to make the x button work
      setPopup({ ...popup, show: false});
  }

  if (loading) {
    return <LoadingScreen message="Signing up..." />; // More relevant message
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Popup Container */}
      {popup.show && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-lg transition-opacity duration-300 ${
            popup.isSuccess ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"
          } border-l-4`}
          style={{ zIndex: 1000 }} // Ensure it's above other elements
        >
           <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={hidePopup}>×</span>
          {popup.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="ECE">Electronics and Communication Engineering</option>
              <option value="EEE">Electronics and Electrical Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="RB">Robotics and Automation Engineering</option>
              <option value="FT">Food Technology </option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Year:</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
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
          <div>
            <label className="block text-gray-700 mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;