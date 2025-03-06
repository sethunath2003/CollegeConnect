import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const LandingPage = () => {
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

        <div className="auth-buttons">
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-text">
          <h3 className="welcome-heading">Welcome to CollegeConnect</h3>
          <h4 className="welcome-subheading">
            Your gateway to College resources, networking and opportunities
          </h4>
        </div>

        <div className="services-grid">
          <div className="card">
            <div
              className="image-container"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 1rem auto",
              }}
            >
              <img src="LetterDrafting.jpg" alt="Compose" />
            </div>
            <h3 className="card-title">Compose</h3>
            <h4 className="card-description">
              Get Assistance in drafting letters for applications, internships
              and more
            </h4>
            <button className="card-button">Learn More</button>
          </div>

          <div className="card">
            <div className="image-container">
              <img src="Book exchange.jpg" alt="Study Material Exchange" />
            </div>
            <h3 className="card-title">Study Material Exchange</h3>
            <h4 className="card-description">
              Share and access a variety of study materials with your peers
            </h4>
            <button className="card-button">Join Now</button>
          </div>

          <div className="card">
            <div className="image-container">
              <img src="Hackathon.jpg" alt="Events" />
            </div>
            <h3 className="card-title">Events & Hackathons</h3>
            <h4 className="card-description">
              Participate in exciting events and hackathons to showcase your
              skills.
            </h4>
            <button className="card-button">Explore</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-text">
          © {new Date().getFullYear()} College Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
