import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const BookPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    cost: "",
    image: null,
    owner_name: "", // Added from the new component
  });

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    // If user is logged in, get their username
    const user = JSON.parse(userData);
    setFormData((prevData) => ({
      ...prevData,
      owner_name: user.username, // Pre-fill owner name from logged-in user
    }));

    // Show loading screen initially
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create form data for file upload
      const bookFormData = new FormData();
      bookFormData.append("title", formData.title);
      bookFormData.append("description", formData.description);
      bookFormData.append("location", formData.location);
      bookFormData.append("cost", formData.cost);
      bookFormData.append("owner_name", formData.owner_name);

      if (formData.image) {
        bookFormData.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:8000/api/books/post/",
        bookFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage({
          text: "Book posted successfully!",
          type: "success",
        });

        // Redirect to book list after short delay
        setTimeout(() => {
          navigate("/bookexchange");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to post book:", error);
      setMessage({
        text: "Failed to post book. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Preparing book post form..." />;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Post a Book for Exchange
      </h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label
            htmlFor="owner_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="owner_name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto-filled from your account
          </p>
        </div>

        <div className="form-group">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Book Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter the title of your book"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the book's condition, edition, and other details"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location for Exchange
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where can others meet you to exchange the book?"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="cost"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cost ($)
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter 0 if you're offering for free
          </p>
        </div>

        <div className="form-group">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Book Cover Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Upload a clear image of the book cover
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-6">
          <Link
            to="/bookexchange"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Post Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookPost;
