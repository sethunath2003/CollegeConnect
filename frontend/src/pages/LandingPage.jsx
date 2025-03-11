import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check for user data in localStorage or sessionStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  // Function to handle module button clicks
  const handleModuleClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      // Show login required message or redirect to login
      navigate("/login");
    }
  };

  // Function to display module info for non-logged in users
  const showModuleInfo = (title, description) => {
    setModalContent({
      title,
      description,
    });
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-12 bg-gray-900">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white">
            Welcome to CollegeConnect
          </h3>
          <h4 className="text-xl text-gray-300 mt-2">
            Your gateway to College resources, networking and opportunities
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src="/LetterDrafting.jpg"
                alt="Compose"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Compose</h3>
            <h4 className="text-gray-600 mb-6">
              Get Assistance in drafting letters for applications, internships
              and more
            </h4>
            <button
              className={`px-4 py-2 rounded w-full text-white ${
                isLoggedIn
                  ? "bg-gray-900 hover:bg-gray-700"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() =>
                isLoggedIn
                  ? handleModuleClick("/letter-drafting")
                  : showModuleInfo(
                      "Letter Drafting Module",
                      "Our Letter Drafting Module helps you create professional letters for various purposes including job applications, internship requests, and recommendation letters. With customizable templates and formatting options, you can quickly draft polished letters that make a great impression. Sign up to start creating your letters today!"
                    )
              }
            >
              {isLoggedIn ? "Learn More" : "Know More"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src="/Book exchange.jpg"
                alt="Study Material Exchange"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Study Material Exchange</h3>
            <h4 className="text-gray-600 mb-6">
              Share and access a variety of study materials with your peers
            </h4>
            <button
              className={`px-4 py-2 rounded w-full text-white ${
                isLoggedIn
                  ? "bg-gray-900 hover:bg-gray-700"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() =>
                isLoggedIn
                  ? handleModuleClick("/bookexchange")
                  : showModuleInfo(
                      "Study Material Exchange",
                      "The Study Material Exchange platform allows students to share notes, textbooks, and other educational resources with fellow students. You can upload your own materials and download those shared by others, creating a collaborative learning environment. This feature helps reduce costs and ensures everyone has access to quality study materials."
                    )
              }
            >
              {isLoggedIn ? "Join Now" : "Know More"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src="/Hackathon.jpg"
                alt="Events"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Events & Hackathons</h3>
            <h4 className="text-gray-600 mb-6">
              Participate in exciting events and hackathons to showcase your
              skills.
            </h4>
            <button
              className={`px-4 py-2 rounded w-full text-white ${
                isLoggedIn
                  ? "bg-gray-900 hover:bg-gray-700"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() =>
                isLoggedIn
                  ? handleModuleClick("/eventlister")
                  : showModuleInfo(
                      "Events & Hackathons",
                      "Stay updated on upcoming hackathons, workshops, and networking events happening in and around your college. The Events feature allows you to browse event details, register for participation, and even create your own events to invite others. Build your portfolio and network with industry professionals through these opportunities."
                    )
              }
            >
              {isLoggedIn ? "Explore" : "Know More"}
            </button>
          </div>
        </div>

        {/* Modal for module information */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg border-3 border-blue-600 p-8 w-11/12 max-w-lg shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 text-center border-b border-gray-200 pb-3">
                {modalContent.title}
              </h3>
              <p className="mb-6 text-gray-600 leading-relaxed">
                {modalContent.description}
              </p>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Close
                </button>
                <Link to="/login">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Login to Access
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white p-4 text-center">
        <div className="footer-text">
          © {new Date().getFullYear()} College Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
