import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booker_name: "",
    booker_email: "",
  });
  const [error, setError] = useState(null);

  // Function to get book details from backend
  const handleGetDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}`);
      if (!response.ok) throw new Error("Failed to fetch book details");
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle reservation input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle reservation submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Post reservation details to backend
      const response = await fetch(`http://localhost:8000/api/books/${id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Reservation failed");
      const updatedBook = await response.json();
      setBook(updatedBook);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout title="Book Detail">
      <div className="container mx-auto px-4 py-8">
        {!book ? (
          <div className="text-center">
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleGetDetails} className="bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
              {loading ? "Loading..." : "Get Details"}
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-700 mb-4">{book.description}</p>
            <div className="mb-4">
              <p className="text-gray-600"><strong>Location:</strong> {book.location}</p>
              <p className="text-gray-600"><strong>Cost:</strong> ${book.cost}</p>
              <p className="text-gray-600"><strong>Owner:</strong> {book.owner_name}</p>
            </div>

            {book.booker_name ? (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-lg font-semibold text-yellow-700">Booked by: {book.booker_name}</h3>
                <p className="text-yellow-600">Contact Email: {book.booker_email}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Reserve this book:</h3>
                <div className="mb-4">
                  <label htmlFor="booker_name" className="block text-sm font-medium text-gray-700">Your Name</label>
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
                  <label htmlFor="booker_email" className="block text-sm font-medium text-gray-700">Your Email</label>
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
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                  {loading ? "Reserving..." : "Reserve Book"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookDetail;
