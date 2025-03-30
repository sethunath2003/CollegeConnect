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
    <main className="py-6 px-4 mb-4 bg-gray-900">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl text-center font-bold text-white">
          Welcome, {username}!
          <p className="text-gray-300 mt-2 text-lg font-normal">
            What would you like to do today?
          </p>
        </h1>
      </div>

      {/* Changed to column layout with centered cards */}
      <div className="flex flex-col items-center max-w-3xl mx-auto gap-8">
        {/* Letter Drafting Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full hover:shadow-lg transition-all duration-300">
          {/* Image at top */}
          <div className="h-56 bg-blue-100 overflow-hidden">
            <img
              src="/LetterDrafting.jpg"
              alt="Letter Drafting"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content below image */}
          <div className="p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Letter Drafting
            </h2>
            <p className="text-gray-600 mb-6">
              Create professional letters for internships, leave applications,
              and permissions.
            </p>
            <Link to="/letter-drafting" className="mt-auto">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                Start Drafting
              </button>
            </Link>
          </div>
        </div>

        {/* Study Material Exchange Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full hover:shadow-lg transition-all duration-300">
          {/* Image at top */}
          <div className="h-56 bg-green-100 overflow-hidden">
            <img
              src="/Book exchange.jpg"
              alt="Study Material Exchange"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content below image */}
          <div className="p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Study Material Exchange
            </h2>
            <p className="text-gray-600 mb-6">
              Share and find textbooks, notes and study materials.
            </p>
            <div className="flex gap-3 mt-auto">
              <Link to="/bookexchange" className="flex-1">
                <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  Browse
                </button>
              </Link>
              <Link to="/bookexchange/post" className="flex-1">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  Post Item
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Events and Hackathons Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full hover:shadow-lg transition-all duration-300">
          {/* Image at top */}
          <div className="h-56 bg-purple-100 overflow-hidden">
            <img
              src="/Hackathon.jpg"
              alt="Events and Hackathons"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content below image */}
          <div className="p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Events and Hackathons
            </h2>
            <p className="text-gray-600 mb-6">
              Stay updated on upcoming events and hackathons.
            </p>
            <div className="flex gap-3 mt-auto">
              <Link to="/eventlister" className="flex-1">
                <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  View Events
                </button>
              </Link>
              <button
                onClick={() => {
                  navigate("/eventlister");
                  setTimeout(() => {
                    const scrapeButton = document.querySelector(
                      'button[class*="bg-indigo-600"]'
                    );
                    if (scrapeButton) {
                      scrapeButton.click();
                    }
                  }, 500);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Get Latest
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Homepage;
