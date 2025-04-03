import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Function to check auth status
  const authStatus = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUsername(user.username);
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    authStatus();

    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === null) {
        authStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(authStatus, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleContactClick = () => {
    setShowContactModal(true);
    setMobileMenuOpen(false);
  };

  const handleContactClose = () => {
    setShowContactModal(false);
    setSubmitStatus(null);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/contact/",
        contactForm
      );
      console.log(response.data);
      if (response.status === 201) {
        setSubmitStatus("success");
        setTimeout(() => {
          setContactForm({
            name: "",
            email: "",
            message: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setSubmitStatus("error");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Main header - adjusted for all breakpoints */}
      <div className="bg-gray-900 text-white p-3 md:p-4 flex items-center justify-between w-full relative">
        {/* Logo with direct Link component */}
        <div className="flex-none pl-2 md:pl-4">
          <Link to="/homepage">
            <h2 className="text-2xl md:text-3xl font-bold">CollegeConnect</h2>
          </Link>
        </div>

        {/* Hamburger Icon - Visible on small/medium screens, hidden on large */}
        <div className="lg:hidden flex items-center justify-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none focus:bg-gray-700 rounded-md"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation with Link components */}
        <div className="hidden lg:flex mx-auto space-x-6">
          <Link to="/homepage">
            <button className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
              Home
            </button>
          </Link>
          <Link to="/about">
            <button className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
              About
            </button>
          </Link>
          <Link to="/services">
            <button className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
              Services
            </button>
          </Link>
          <button
            className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors"
            onClick={handleContactClick}
          >
            Contact
          </button>
        </div>

        {/* Auth Controls - Adjusted for all breakpoints */}
        <div className="flex-none pr-2 md:pr-4">
          {isLoggedIn ? (
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:inline text-white ml-2 mr-4">
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="hidden lg:block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex">
              <Link to="/login">
                <button className="px-3 py-1 md:px-4 md:py-2 bg-gray-700 text-white rounded text-sm md:text-base hover:bg-gray-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup" className="hidden lg:block ml-2">
                <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu with Link components */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link
              to="/homepage"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-gray-700 rounded transition-colors block"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-gray-700 rounded transition-colors block"
            >
              About
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-gray-700 rounded transition-colors block"
            >
              Services
            </Link>
            <button
              className="py-2 px-4 text-left hover:bg-gray-700 rounded transition-colors block"
              onClick={handleContactClick}
            >
              Contact
            </button>

            {/* Mobile Auth Options */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-2 px-4 text-left bg-red-600 text-white rounded hover:bg-red-700 mt-4 transition-colors block"
              >
                Logout ({username})
              </button>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 bg-gray-700 text-white rounded text-center hover:bg-gray-600 transition-colors block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 bg-gray-700 text-white rounded text-center hover:bg-gray-600 transition-colors block"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Modal remains unchanged */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={handleContactClose}
        >
          <div
            className="bg-white rounded-lg p-6 md:p-8 w-11/12 max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Contact form content - unchanged */}
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
              Contact Us
            </h3>

            {submitStatus === "success" ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : submitStatus === "error" ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Failed to send message. Please try again later.
              </div>
            ) : null}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Form content - unchanged */}
              {/* ... */}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
