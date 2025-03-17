import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    booker_name: "",
    booker_email: "",
  });

  useEffect(() => {
    // Fetch book details - in a real app you would call an API
    setLoading(false);
    // Mock data for display purposes
    setBook({
      id: id,
      title: "Example Book",
      description: "This is a sample book description.",
      location: "University Library",
      cost: 15.99,
      owner_name: "John Doe",
      booker_name: null,
      booker_email: null,
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
    // In a real app, you would submit this to your API
    setBook({
      ...book,
      booker_name: formData.booker_name,
      booker_email: formData.booker_email,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Book Selection">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 mb-4">{book.description}</p>
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Location:</strong> {book.location}
            </p>
            <p className="text-gray-600">
              <strong>Cost:</strong> ${book.cost}
            </p>
            <p className="text-gray-600">
              <strong>Owner:</strong> {book.owner_name}
            </p>
          </div>

          {book.booker_name ? (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-lg font-semibold text-yellow-700">
                Booked by: {book.booker_name}
              </h3>
              <p className="text-yellow-600">
                Contact Email: {book.booker_email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Book this item:</h3>
              <div className="mb-4">
                <label
                  htmlFor="booker_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="booker_name"
                  name="booker_name"
                  value={formData.booker_name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="booker_email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="booker_email"
                  name="booker_email"
                  value={formData.booker_email}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookDetail;
