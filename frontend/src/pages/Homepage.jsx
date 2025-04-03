import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const Homepage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    setUsername(user.username);

    // Show loading animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 saintgits-bg">
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white">
            Welcome to CollegeConnect, {username}!
          </h3>
          <h4 className="text-xl text-gray-100 mt-2">
            Your gateway to College resources, networking and opportunities
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Letter Drafting Card */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-300 p-6 text-center hover:shadow-2xl transition-shadow">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 shadow-md">
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
            <Link to="/letter-drafting">
              <button className="px-4 py-2 rounded w-full text-white bg-gray-900 hover:bg-gray-700 transition-colors">
                Start Drafting
              </button>
            </Link>
          </div>

          {/* Study Material Exchange Card */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-300 p-6 text-center hover:shadow-2xl transition-shadow">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 shadow-md">
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
            <div className="flex gap-3">
              <Link to="/bookexchange" className="flex-1">
                <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                  Browse
                </button>
              </Link>
              <Link to="/bookexchange/post" className="flex-1">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors">
                  Post Item
                </button>
              </Link>
            </div>
          </div>

          {/* Events & Hackathons Card */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-300 p-6 text-center hover:shadow-2xl transition-shadow">
            <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 shadow-md">
              <img
                src="/Hackathon.jpg"
                alt="Events"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Events & Hackathons</h3>
            <h4 className="text-gray-600 mb-6">
              Participate in exciting events and hackathons to showcase your
              skills
            </h4>
            <Link to="/eventlister">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                View Events
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white p-4 text-center">
        <div className="footer-text">
          © {new Date().getFullYear()} College Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
