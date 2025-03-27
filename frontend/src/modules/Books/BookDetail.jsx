import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/books/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBook(response.data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Loading book details..." />;
  }

  if (error) {
    return (
      <div className="flex-grow p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            to="/bookexchange"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-grow p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Book not found
          </h2>
          <Link
            to="/bookexchange"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Book Details</h1>
          <Link
            to="/bookexchange"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Books
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-4">
              <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
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
            </div>
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-xl font-bold text-green-600 mb-4">
                ${book.cost}
              </p>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Description:
                </h3>
                <p className="text-gray-600">{book.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Details:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Posted by: {book.owner_name || "Anonymous"}</li>
                  <li>Location: {book.location}</li>
                  {book.booker_name && (
                    <li className="text-red-600 font-semibold">
                      This book has been booked by {book.booker_name}
                    </li>
                  )}
                </ul>
              </div>

              {book.booker_name && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                    Booking Information
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-semibold">Booked by:</span>{" "}
                    {book.booker_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span>{" "}
                    {book.booker_email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
