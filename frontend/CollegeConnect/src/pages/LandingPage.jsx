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
    <div className="page-container">
      <header className="header">
        <div className="logo">
          <h2 className="logo-text">CollegeConnect</h2>
        </div>

        <div className="nav-buttons">
          <button>Home</button>
          <button>About</button>
          <button>Services</button>
          <button>Contact</button>
        </div>

        {isLoggedIn ? (
          <div className="user-info">
            <div className="avatar-container">
              {/* Default avatar if no image is available */}
              <div className="avatar">{username.charAt(0).toUpperCase()}</div>
            </div>
            <span className="username">{username}</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                setUsername("");
              }}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="welcome-text">
          <h3 className="welcome-heading">Welcome to CollegeConnect</h3>
          <h4 className="welcome-subheading">
            Your gateway to College resources, networking and opportunities
          </h4>
          {!isLoggedIn && (
            <p className="login-prompt">
              Please <Link to="/login">login</Link> or{" "}
              <Link to="/signup">sign up</Link> to access all features
            </p>
          )}
        </div>

        <div className="services-grid">
          <div className="card">
            <div className="image-container">
              <img src="/LetterDrafting.jpg" alt="Compose" />
            </div>
            <h3 className="card-title">Compose</h3>
            <h4 className="card-description">
              Get Assistance in drafting letters for applications, internships
              and more
            </h4>
            <button
              className={`card-button ${!isLoggedIn ? "info-button" : ""}`}
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

          <div className="card">
            <div className="image-container">
              <img src="/Book exchange.jpg" alt="Study Material Exchange" />
            </div>
            <h3 className="card-title">Study Material Exchange</h3>
            <h4 className="card-description">
              Share and access a variety of study materials with your peers
            </h4>
            <button
              className={`card-button ${!isLoggedIn ? "info-button" : ""}`}
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

          <div className="card">
            <div className="image-container">
              <img src="/Hackathon.jpg" alt="Events" />
            </div>
            <h3 className="card-title">Events & Hackathons</h3>
            <h4 className="card-description">
              Participate in exciting events and hackathons to showcase your
              skills.
            </h4>
            <button
              className={`card-button ${!isLoggedIn ? "info-button" : ""}`}
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
      </main>

      {/* Modal for module information */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{modalContent.title}</h3>
            <p className="modal-description">{modalContent.description}</p>
            <div className="modal-actions">
              <button className="modal-close" onClick={closeModal}>
                Close
              </button>
              <Link to="/login">
                <button className="modal-login">Login to Access</button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-text">
          © {new Date().getFullYear()} College Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
