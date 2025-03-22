import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder image as base64 or URL to avoid the import issue
  const defaultBookCover = "https://placehold.co/400x600";

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // This would be your actual API endpoint
        const response = await axios.get("http://localhost:8000/api/books/");
        setBooks(response.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again.");
      } finally {
        // Simulate a short loading time for better UX
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter books based on search query (client-side filtering for now)
    // In a real app, you might want to make an API call instead
    console.log("Searching for:", searchQuery);
  };

  if (loading) {
    return <LoadingScreen message="Loading available books..." />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Books Exchange</h1>
          <Link
            to="/bookexchange/post"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Post a Book
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search for books by title, author, or subject..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
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
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No books available yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to share your books with the community!
              </p>
              <Link
                to="/bookexchange/post"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Post Your Book
              </Link>
            </div>
          )}
        </div>

        {/* Display placeholder books for demonstration */}
        {books.length === 0 && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Example Book Title
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Posted by: User</p>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    $15.99
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Location: Main Campus
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Login to View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
