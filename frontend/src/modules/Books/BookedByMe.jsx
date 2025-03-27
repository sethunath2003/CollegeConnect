import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const BookedByMe = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Default image for books without cover
  const defaultBookCover = "https://placehold.co/400x600";

  // Helper function to build the full image URL
  const getBookImageUrl = (image) => {
    if (!image) return defaultBookCover;
    return image.startsWith("http")
      ? image // Use as-is if already a full URL
      : `http://localhost:8000/${image.replace(/^\//, "")}`; // Otherwise, construct URL
  };

  // Fetch books booked by the current user when component mounts
  useEffect(() => {
    const fetchBookedBooks = async () => {
      // Get user data from localStorage
      const storedUserData = localStorage.getItem("user");
      if (!storedUserData) {
        // If not logged in, redirect to login page
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUserData);
        setUserData(userData);

        // Fetch books booked by the current user using the correct endpoint
        const response = await axios.get(
          "http://localhost:8000/api/books/booked_by_me/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Check if the response has the expected structure
        const booksData = response.data.results || response.data;
        setBooks(Array.isArray(booksData) ? booksData : []);
      } catch (err) {
        console.error("Failed to fetch booked books:", err);
        setError("Failed to load your booked books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedBooks();
  }, [navigate]);

  if (loading) {
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
                      src={getBookImageUrl(book.cover_image)}
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
                    to={`/bookexchange/book/${book.id}`}
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
              You haven't booked any books yet
            </h2>
            <p className="text-gray-600 mb-6">
              Browse the books exchange to find books you're interested in.
            </p>
            <Link
              to="/bookexchange"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Available Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedByMe;
