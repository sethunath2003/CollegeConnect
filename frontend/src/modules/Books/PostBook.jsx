import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const PostBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    cost: "",
    owner_name: "",
    owner_email: "",
    cover_image: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login", { state: { from: "/bookexchange/post" } });
      return;
    }

    const user = JSON.parse(userData);
    setFormData((prevData) => ({
      ...prevData,
      owner_name: user.username,
      owner_email: user.email,
    }));

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.cost === "") {
      newErrors.cost = "Cost is required";
    } else if (
      isNaN(parseFloat(formData.cost)) ||
      parseFloat(formData.cost) < 0
    ) {
      newErrors.cost = "Cost must be a non-negative number";
    }

    if (formData.cover_image && formData.cover_image.size > 5 * 1024 * 1024) {
      newErrors.cover_image = "Image size must be less than 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors({
        ...errors,
        cover_image: "Please select an image file (JPEG, PNG, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        cover_image: "Image size must be less than 5MB",
      });
      return;
    }

    setFormData({
      ...formData,
      cover_image: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    if (errors.cover_image) {
      setErrors({
        ...errors,
        cover_image: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = document.querySelector(".error-message");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookFormData = new FormData();

      for (const key in formData) {
        bookFormData.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:8000/api/books/create/",
        bookFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate(`/bookexchange/book/${response.data.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error posting book:", err);

      if (err.response && err.response.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Failed to post book. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }

      setLoading(false);
    }
  };

  if (loading && !error && !success) {
    return <LoadingScreen message="Processing your book submission..." />;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Post a Book for Exchange
      </h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Book posted successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
            className={`w-full p-2 border ${
              errors.owner_name ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            readOnly
          />
          {errors.owner_name && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.owner_name}
            </p>
          )}
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
            className={`w-full p-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            placeholder="Enter the title of your book"
          />
          {errors.title && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.title}
            </p>
          )}
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
            className={`w-full p-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="4"
            required
          ></textarea>
          {errors.description && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.description}
            </p>
          )}
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
            className={`w-full p-2 border ${
              errors.location ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.location && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.location}
            </p>
          )}
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
            className={`w-full p-2 border ${
              errors.cost ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
          {errors.cost && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.cost}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter 0 if you're offering for free
          </p>
        </div>

        <div className="form-group">
          <label
            htmlFor="cover_image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Book Cover Image
          </label>
          <input
            type="file"
            id="cover_image"
            name="cover_image"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full p-2 border ${
              errors.cover_image ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.cover_image && (
            <p className="error-message text-red-500 text-xs mt-1">
              {errors.cover_image}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Optional. Max size: 5MB. Recommended size: 400x600px.
          </p>

          {previewImage && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={previewImage}
                alt="Book cover preview"
                className="w-48 h-auto object-contain border border-gray-300 rounded"
              />
            </div>
          )}
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

export default PostBook;
