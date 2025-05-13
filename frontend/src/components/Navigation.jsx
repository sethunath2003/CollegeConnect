import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContactForm from "../components/ContactForm";

const Navigation = () => {
  const navigate = useNavigate();

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Contact form modal state
  const [showContactModal, setShowContactModal] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUsername(user.username);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    // Check on mount and when storage changes
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update auth status
    setIsLoggedIn(false);
    setUsername("");

    // Clear auth header
    delete axios.defaults.headers.common["Authorization"];

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"));

    // Navigate to landing page
    navigate("/");
  };

  return (
    <header>
      {/* Main header - adjusted for all breakpoints */}
      <div className="bg-gray-900 text-white p-3 md:p-4 flex items-center justify-between w-full relative">
        {/* Logo modified to work as a back button */}
        <div className="flex-none pl-2 md:pl-4">
          <button
            onClick={() => navigate(-1)} // This navigates to the previous page in history
            className="text-2xl md:text-3xl font-bold text-white hover:text-blue-300 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            CollegeConnect
          </button>
        </div>

        {/* Desktop Navigation Links - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            // Links for logged in users
            <>
              <Link
                to="/homepage"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-blue-300 transition-colors"
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Services
              </Link>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Contact
              </button>
            </>
          ) : (
            // Links for guests
            <>
              <Link
                to="/about"
                className="text-white hover:text-blue-300 transition-colors"
              >
                About
              </Link>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Contact
              </button>
            </>
          )}
        </div>

        {/* Authentication Section - visible on desktop */}
        <div className="hidden md:flex items-center space-x-4 pr-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-blue-300">Hello, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - only visible on mobile */}
        <button
          className="md:hidden flex items-center px-3 py-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12" // X shape when menu is open
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger when menu is closed
              }
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white py-4 px-6">
          {isLoggedIn ? (
            <>
              <div className="py-2 px-4 border-b border-gray-700">
                <p className="text-blue-300">Hello, {username}</p>
              </div>
              <div className="py-2">
                <Link
                  to="/services"
                  className="block px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/eventlister"
                  className="block px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/bookexchange"
                  className="block px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Books
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/about"
                  className="block px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                >
                  Contact Us
                </button>
              </div>
              <div className="py-2 mt-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="py-2">
                <Link
                  to="/about"
                  className="block px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                >
                  Contact Us
                </button>
              </div>
              <div className="py-2 mt-4">
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Contact modal using shared component */}
      {showContactModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <ContactForm onClose={() => setShowContactModal(false)} />
        </div>
      )}
    </header>
  );
};

export default Navigation;
