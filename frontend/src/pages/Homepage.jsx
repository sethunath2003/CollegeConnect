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
    <main className="py-6 px-4 mb-4">
      {" "}
      {/* Reduced bottom margin */}
      {/* Welcome message with user's name */}
      <div className="mb-6">
        <h1 className="text-2xl text-center font-bold text-white">Welcome, {username}!
          <p className="text-gray-300">What would you like to do today?</p>
        </h1>
      </div>
      {/* Changed to 2-column layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Letter Drafting Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            {" "}
            {/* Increased height */}
            <img
              src="/LetterDrafting.jpg"
              alt="Letter Drafting"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            {" "}
            {/* Increased padding */}
            <h2 className="text-2xl font-bold mb-4">Letter Drafting</h2>
            <p className="mb-6 text-gray-600">
              Create professional letters for internships, leave applications,
              and permissions.
            </p>
            <Link to="/letter-drafting">
              <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors">
                Start Drafting
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Study Material Exchange Card - Now in second column */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-40 bg-green-100 flex items-center justify-center">
              <img
                src="/Book exchange.jpg"
                alt="Study Material Exchange"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              {" "}
              {/* Increased padding */}
              <h2 className="text-2xl font-bold mb-4">
                Study Material Exchange
              </h2>
              <p className="mb-6 text-gray-600">
                Share and find textbooks, notes and study materials.
              </p>
              <div className="flex space-x-4">
                <Link to="/bookexchange" className="flex-1">
                  <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors">
                    Browse Materials
                  </button>
                </Link>
                <Link to="/bookexchange/post" className="flex-1">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors">
                    Post Item
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Events and Hackathons Card - Now in second column */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-40 bg-purple-100 flex items-center justify-center">
              <img
                src="/Hackathon.jpg"
                alt="Events and Hackathons"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              {" "}
              {/* Increased padding */}
              <h2 className="text-2xl font-bold mb-4">Events and Hackathons</h2>
              <p className="mb-6 text-gray-600">
                Stay updated on upcoming events and hackathons.
              </p>
              <div className="flex space-x-4">
                <Link to="/eventlister" className="flex-1">
                  <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors">
                    View Events
                  </button>
                </Link>
                <Link to="/events/new" className="flex-1">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors">
                    Post Event
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Homepage;
