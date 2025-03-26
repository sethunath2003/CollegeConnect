import React, { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const BookList = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State variables for managing books data and UI
  const [books, setBooks] = useState([]); // All books from API
  const [filteredBooks, setFilteredBooks] = useState([]); // Books after filtering/search
  const [searchQuery, setSearchQuery] = useState(""); // Current search query
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(null); // Error state for API calls
  const [isSearchActive, setIsSearchActive] = useState(false); // Whether search is being used

  // State for booking feature
  const [bookingBookId, setBookingBookId] = useState(null); // ID of book being booked
  const [bookingFormData, setBookingFormData] = useState({
    booker_name: "", // Name of person booking
    booker_email: "", // Email of person booking
  });
  const [bookingError, setBookingError] = useState(""); // Error during booking
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Login status

  // Default image for books without cover
  const defaultBookCover = "https://placehold.co/400x600";

  // Helper function to build the full image URL
  const getBookImageUrl = (image) => {
    if (!image) return defaultBookCover;
    return image.startsWith("http")
      ? image // Use as-is if already a full URL
      : `http://localhost:8000/${image.replace(/^\//, "")}`; // Otherwise, construct URL
  };

  // Check if user is logged in and get their info
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserLoggedIn(true);

      // Set booking form data with user info
      setBookingFormData({
        booker_name: user.username,
        booker_email: user.email, // No fallback, use exactly what comes from backend
      });
    }
  }, []);

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Call the API to get all books
        const response = await axios.get("http://localhost:8000/api/books/");
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again.");
      } finally {
        // Add a slight delay for better UX
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchBooks();
  }, []);

  // Handle form submission for search
  const handleSearch = (e) => {
    e.preventDefault();

    // If search query is empty, reset to show all books
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      setIsSearchActive(false);
      return;
    }

    // Filter books based on search query (case-insensitive)
    const searchResults = books.filter((book) => {
      const query = searchQuery.toLowerCase();
      return (
        (book.title && book.title.toLowerCase().includes(query)) ||
        (book.description && book.description.toLowerCase().includes(query)) ||
        (book.owner_name && book.owner_name.toLowerCase().includes(query))
      );
    });

    // Update state with filtered results
    setFilteredBooks(searchResults);
    setIsSearchActive(true);
  };

  // Handle input changes in the search box
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Real-time filtering as user types
    if (!e.target.value.trim()) {
      setFilteredBooks(books);
      setIsSearchActive(false);
    } else {
      const searchResults = books.filter((book) => {
        const query = e.target.value.toLowerCase();
        return (
          (book.title && book.title.toLowerCase().includes(query)) ||
          (book.description &&
            book.description.toLowerCase().includes(query)) ||
          (book.owner_name && book.owner_name.toLowerCase().includes(query))
        );
      });
      setFilteredBooks(searchResults);
      setIsSearchActive(true);
    }
  };

  // Clear search and show all books
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBooks(books);
    setIsSearchActive(false);
  };

  // Submit booking request to API
  const submitBooking = async (bookId) => {
    // Check if user is logged in before booking
    if (!userLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      // Call API to book the selected book
      const response = await axios.post(
        `http://localhost:8000/api/books/${bookId}/select_book/`,
        bookingFormData
      );

      // Update local state to reflect changes
      const updatedBooks = books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              booker_name: bookingFormData.booker_name,
              booker_email: bookingFormData.booker_email,
            }
          : book
      );

      setBooks(updatedBooks);
      setFilteredBooks(
        filteredBooks.map((book) =>
          book.id === bookId
            ? {
                ...book,
                booker_name: bookingFormData.booker_name,
                booker_email: bookingFormData.booker_email,
              }
            : book
        )
      );

      // Reset booking state
      setBookingBookId(null);
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError("Booking failed. Please try again.");
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return <LoadingScreen message="Loading available books..." />;
  }

  // Determine which books to display (filtered or all)
  const displayBooks = filteredBooks;

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and post button */}
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
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for books by title, author, or subject..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {/* Clear search button, only shown when search is active */}
            {isSearchActive && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search Results Info */}
        {isSearchActive && (
          <div className="mb-4 text-gray-700">
            {filteredBooks.length === 0 ? (
              <p>
                No results found for "{searchQuery}".{" "}
                <button
                  onClick={clearSearch}
                  className="text-blue-500 underline"
                >
                  Show all books
                </button>
              </p>
            ) : (
              <p>
                Found {filteredBooks.length} result
                {filteredBooks.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {/* Books Grid - Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => (
              <div
                key={book.id}
                className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                  book.booker_name ? "opacity-75" : ""
                }`}
              >
                {/* "BOOKED" ribbon for already booked books */}
                {book.booker_name && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-1 font-bold z-10">
                    BOOKED
                  </div>
                )}

                {/* Book cover image */}
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

                {/* Book details */}
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

                  {/* Booking button or confirmation dialog */}
                  {!book.booker_name &&
                    (bookingBookId === book.id ? (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">
                          Confirm Booking
                        </h4>
                        <p className="text-sm">
                          You'll book this as:{" "}
                          <strong>{bookingFormData.booker_name}</strong>
                        </p>
                        <p className="text-sm">
                          Contact email:{" "}
                          <strong>{bookingFormData.booker_email}</strong>
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitBooking(book.id)}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setBookingBookId(null);
                              setBookingError("");
                            }}
                            className="flex-1 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                        {bookingError && (
                          <p className="text-red-500 text-sm mt-2">
                            {bookingError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!userLoggedIn) {
                            navigate("/login");
                            return;
                          }
                          setBookingBookId(book.id);
                        }}
                        className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Book Now
                      </button>
                    ))}
                </div>
              </div>
            ))
          ) : (
            // No books found message
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {isSearchActive
                  ? "No matching books found"
                  : "No books available yet"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isSearchActive ? (
                  <span>
                    Try different search terms or{" "}
                    <button
                      onClick={clearSearch}
                      className="text-blue-500 underline"
                    >
                      browse all books
                    </button>
                  </span>
                ) : (
                  "Be the first to share your books with the community!"
                )}
              </p>
              {!isSearchActive && (
                <Link
                  to="/bookexchange/post"
                  className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Post Your Book
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Placeholder books shown when no real books are available */}
        {books.length === 0 && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display placeholder books */}
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
