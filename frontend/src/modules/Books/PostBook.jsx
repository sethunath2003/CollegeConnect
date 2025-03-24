import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const PostBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner_name: "",
    title: "",
    description: "",
    location: "",
    cost: "",
    cover_image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cover_image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Redirect to home page after submission
    navigate("/");
  };

  return (
    <Layout title="Post Book">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Post a Book Availability</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label
              htmlFor="owner_name"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              type="text"
              id="owner_name"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Book Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Cost
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="cover_image"
              className="block text-sm font-medium text-gray-700"
            >
              Book Cover Image (JPG)
            </label>
            <input
              type="file"
              id="cover_image"
              name="cover_image"
              onChange={handleFileChange}
              className="w-full p-2 mt-1 border rounded-md"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Post Book
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PostBook;
