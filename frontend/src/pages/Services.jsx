import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Our Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Letter Drafting Service */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <img
              src="/LetterDrafting.jpg"
              alt="Letter Drafting"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3">
              Letter Drafting Assistant
            </h2>
            <p className="mb-4 text-gray-600">
              Create professional letters for various purposes with customizable
              templates.
            </p>
            <ul className="list-disc ml-5 mb-4 text-gray-600">
              <li>Internship request letters</li>
              <li>Leave application letters</li>
              <li>Permission request letters</li>
              <li>Recommendation requests</li>
            </ul>
            <Link to="/letter-drafting">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                Start Drafting
              </button>
            </Link>
          </div>
        </div>

        {/* Book Exchange Service */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-green-100 flex items-center justify-center">
            <img
              src="/Book exchange.jpg"
              alt="Book Exchange"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3">Study Material Exchange</h2>
            <p className="mb-4 text-gray-600">
              Share and find textbooks, notes, and academic resources.
            </p>
            <ul className="list-disc ml-5 mb-4 text-gray-600">
              <li>Post books for sale or exchange</li>
              <li>Find course materials at affordable prices</li>
              <li>Connect with students in your courses</li>
              <li>Reduce textbook expenses</li>
            </ul>
            <Link to="/bookexchange">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                Browse Materials
              </button>
            </Link>
          </div>
        </div>

        {/* Events Service */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-purple-100 flex items-center justify-center">
            <img
              src="/Hackathon.jpg"
              alt="Events and Hackathons"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3">Events & Hackathons</h2>
            <p className="mb-4 text-gray-600">
              Stay updated on campus activities and opportunities.
            </p>
            <ul className="list-disc ml-5 mb-4 text-gray-600">
              <li>Discover upcoming hackathons</li>
              <li>Find networking events</li>
              <li>Join workshops and seminars</li>
            </ul>
            <Link to="/eventlister">
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors">
                Explore Events
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
