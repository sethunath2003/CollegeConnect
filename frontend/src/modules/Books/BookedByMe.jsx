import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const BookedByMe = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Placeholder image as base64 or URL
  const defaultBookCover = "https://placehold.co/400x600";

  // Handle email input change
  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  // Submit search by email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/booked-by-me/?email=${encodeURIComponent(
          userEmail
        )}`
      );
      setBooks(response.data.results);
    } catch (err) {
      console.error("Failed to fetch booked books:", err);
      setError("Failed to load your booked books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) {
    return <LoadingScreen message="Loading your booked books..." />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Books I've Booked
          </h1>
          <Link
            to="/bookexchange"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Book Exchange
          </Link>
        </div>

        {/* Email Search Form */}
        
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Find My Bookings
            </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={book.image || defaultBookCover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultBookCover;
                      }}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-1 font-bold">
                    BOOKED
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Posted by: {book.owner_name || "Anonymous"}
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ${book.cost}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Location: {book.location}
                  </p>
                  <Link
                    to={`/books/${book.id}`}
                    className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {userEmail
                ? "No books found"
                : "Enter your email to see your booked books"}
            </h2>
            <p className="text-gray-600 mb-6">
              {userEmail
                ? "You haven't booked any books yet."
                : "Please enter the email you used when booking books."}
            </p>
            {userEmail && (
              <Link
                to="/bookexchange"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Available Books
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedByMe;
