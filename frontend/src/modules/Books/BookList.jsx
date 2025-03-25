import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // New state for booking
  const [bookingBookId, setBookingBookId] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    booker_name: "",
    booker_email: "",
  });
  const [bookingError, setBookingError] = useState("");

  // // Placeholder image as base64 or URL to avoid the import issue
  // const defaultBookCover = "https://placehold.co/400x600";

  // Helper to build the full image URL
  const getBookImageUrl = (image) => {
    if (!image) return defaultBookCover;
    // Ensure that there's a slash between the base URL and the relative path
    return image.startsWith("http")
      ? image
      : `http://localhost:8000/${image.replace(/^\//, "")}`;
  };

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // This would be your actual API endpoint
        const response = await axios.get("http://localhost:8000/api/books/");
        setBooks(response.data);
        setFilteredBooks(response.data);
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

    setFilteredBooks(searchResults);
    setIsSearchActive(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
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

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBooks(books);
    setIsSearchActive(false);
  };

  const submitBooking = async (bookId) => {
    if (!bookingFormData.booker_name || !bookingFormData.booker_email) {
      setBookingError("Both name and email are required");
      return;
    }
    try {
      // Try the viewset action first
      try {
        const response = await axios.post(
          `http://localhost:8000/api/books/${bookId}/select_book/`,
          bookingFormData
        );
        // Update books and filtered books state...
      } catch (err) {
        // If that fails, try the direct endpoint
      }

      // Update states after successful booking
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

      setBookingBookId(null);
      setBookingFormData({ booker_name: "", booker_email: "" });
      setBookingError("");
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError("Booking failed. Please try again.");
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading available books..." />;
  }

  // Determine which books to display (filtered or all)
  const displayBooks = filteredBooks;

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
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for books by title, author, or subject..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
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

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => (
              <div
                key={book.id}
                className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                  book.booker_name ? "opacity-75" : ""
                }`}
              >
                {book.booker_name && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-1 font-bold z-10">
                    BOOKED
                  </div>
                )}

                {/* Rest of your card content */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={getBookImageUrl(book.image)}
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
                  {!book.booker_name &&
                    (bookingBookId === book.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={bookingFormData.booker_name}
                          onChange={(e) =>
                            setBookingFormData({
                              ...bookingFormData,
                              booker_name: e.target.value,
                            })
                          }
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={bookingFormData.booker_email}
                          onChange={(e) =>
                            setBookingFormData({
                              ...bookingFormData,
                              booker_email: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitBooking(book.id)}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Submit
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
                          <p className="text-red-500 text-sm">{bookingError}</p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setBookingBookId(book.id);
                          setBookingFormData({
                            booker_name: "",
                            booker_email: "",
                          });
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

        {/* The placeholder books section remains unchanged */}
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
