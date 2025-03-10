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
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">CollegeConnect</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{username}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Letter Drafting Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-blue-100 flex items-center justify-center">
            <img
              src="/LetterDrafting.jpg"
              alt="Letter Drafting"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Letter Drafting</h2>
            <Link to="/letter-drafting">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                Start Drafting
              </button>
            </Link>
          </div>
        </div>

        {/* Study Material Exchange Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-green-100 flex items-center justify-center">
            <img
              src="/Book exchange.jpg"
              alt="Study Material Exchange"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Study Material Exchange</h2>
            <Link to="/bookexchange">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                Go For Exchange
              </button>
            </Link>
          </div>
        </div>

        {/* Events and Hackathons Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-purple-100 flex items-center justify-center">
            <img
              src="/Hackathon.jpg"
              alt="Events and Hackathons"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Events and Hackathons</h2>
            <Link to="/eventlister">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                View Events and Hackathons
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
