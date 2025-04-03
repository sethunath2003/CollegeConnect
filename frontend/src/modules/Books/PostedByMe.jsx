import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const PostedByMe = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
  });

  // Add these missing definitions
  // Default image for books without cover
  const defaultBookCover = "https://placehold.co/400x600";

  // Helper function to build the full image URL
  const getBookImageUrl = (image) => {
    if (!image) return defaultBookCover;
    return image.startsWith("http")
      ? image // Use as-is if already a full URL
      : `http://localhost:8000/${image.replace(/^\//, "")}`; // Otherwise, construct URL
  };

  useEffect(() => {
    const fetchPostedBooks = async () => {
      const storedUserData = localStorage.getItem("user");
      if (!storedUserData) {
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUserData);
        setUserData(userData);

        const response = await axios.get(
          "http://localhost:8000/api/books/posted_by_me/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const booksData = response.data.results || response.data;
        setBooks(Array.isArray(booksData) ? booksData : []);
      } catch (err) {
        console.error("Failed to fetch posted books:", err);
        setError("Failed to load your posted books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostedBooks();
  }, [navigate]);

  // Function to handle viewing a book - navigates to the book detail page
  const handleViewBook = (bookId) => {
    navigate(`/bookexchange/book/${bookId}`);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      location: book.location,
      cost: book.cost,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (bookId) => {
    try {
      setLoading(true);
      
      // Use the correct API endpoint - this should match what's defined in your backend
      const response = await axios.patch(
        `http://localhost:8000/api/books/update/${bookId}/`,  // Updated endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",  // Explicitly set content type
          },
        }
      );

      // Update local state with the edited data
      setBooks(
        books.map((book) =>
          book.id === bookId ? { ...book, ...formData } : book
        )
      );

      // Exit edit mode
      setEditingBook(null);
      
      // Show success message (optional)
      setError(null); // Clear any previous errors
      
    } catch (err) {
      console.error("Failed to update book:", err);
      
      // Provide detailed error message
      if (err.response) {
        setError(`Failed to update book: ${err.response.status} ${err.response.statusText}`);
      } else {
        setError("Failed to update book. Network error or server unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(`http://localhost:8000/api/books/delete/${bookId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setBooks(books.filter((book) => book.id !== bookId));

      setError(null);
    } catch (err) {
      console.error("Failed to delete book:", err);

      if (err.response) {
        setError(
          `Failed to delete book: ${err.response.status} ${err.response.statusText}`
        );
      } else {
        setError("Failed to delete book. Network error or server unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your posted books..." />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Books I've Posted
          </h1>
          <div className="flex gap-3">
            <Link
              to="/bookexchange"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Book Exchange
            </Link>
            <Link
              to="/bookexchange/post"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Post Another Book
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                {book.booker_name && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-1 font-bold z-10">
                    BOOKED
                  </div>
                )}

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

                {editingBook && editingBook.id === book.id ? (
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Edit Book
                    </h3>
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded h-24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Cost
                        </label>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          step="0.01"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleSaveEdit(book.id)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {book.title}
                    </h3>
                    {book.booker_name && (
                      <p className="text-sm bg-yellow-100 p-2 rounded mb-2">
                        <span className="font-semibold">Booked by:</span>{" "}
                        {book.booker_name}
                        <br />
                        <span className="font-semibold">Contact:</span>{" "}
                        {book.booker_email}
                      </p>
                    )}
                    <p className="text-lg font-bold text-green-600 mb-2">
                      ${book.cost}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Location: {book.location}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        to={`/bookexchange/book/${book.id}`}
                        state={{ from: "/bookexchange/posted" }}
                        className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </Link>

                      {!book.booker_name && (
                        <>
                          <button
                            onClick={() => handleEditBook(book)}
                            className="flex-1 text-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              You haven't posted any books yet
            </h2>
            <p className="text-gray-600 mb-6">
              Share your books with the college community by posting them here.
            </p>
            <Link
              to="/bookexchange/post"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Post Your First Book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedByMe;
