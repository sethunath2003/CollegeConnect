import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        About College Connect
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          College Connect is designed to enhance the college experience by
          providing a platform that connects students, facilitates resource
          sharing, and simplifies common academic tasks. Our mission is to make
          college life more efficient and collaborative through technology.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-blue-700 mb-2">
              Letter Drafting Assistant
            </h3>
            <p className="text-gray-600">
              Create professional letters for internships, leave applications,
              and permissions with our customizable templates.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-green-700 mb-2">
              Study Material Exchange
            </h3>
            <p className="text-gray-600">
              Share and find textbooks, notes, and study materials with fellow
              students on our community marketplace.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-purple-700 mb-2">
              Events & Hackathons
            </h3>
            <p className="text-gray-600">
              Stay updated on campus events, competitions, and networking
              opportunities.
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-yellow-700 mb-2">
              Community Support
            </h3>
            <p className="text-gray-600">
              Connect with peers, alumni, and professors to build your college
              network.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          College Connect was created by a dedicated team of student developers
          who understand the challenges and needs of college life. We're
          constantly working to improve the platform based on user feedback and
          emerging needs.
        </p>
      </div>
    </div>
  );
};

export default About;
