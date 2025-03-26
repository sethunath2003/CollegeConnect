// Import necessary hooks from React
import { useState, useEffect } from "react";
// Import useParams to access URL parameters (like book ID)
import { useParams } from "react-router-dom";
// Import the Layout component for consistent page structure
import Layout from "../../components/Layout";

const BookDetail = () => {
  // Extract the 'id' parameter from the URL
  const { id } = useParams();

  // State to store the book details once fetched
  const [book, setBook] = useState(null);

  // Loading state to handle UI during API requests
  const [loading, setLoading] = useState(false);

  // Form data state for the booking form
  const [formData, setFormData] = useState({
    booker_name: "", // Will store the name of person booking the book
    booker_email: "", // Will store the email of person booking the book
  });

  // State to store any error messages
  const [error, setError] = useState(null);

  // Function to fetch book details from the API
  const handleGetDetails = async () => {
    // Set loading to true to show loading indicator
    setLoading(true);
    // Clear any previous errors
    setError(null);
    try {
      // Make a GET request to the API to fetch book details
      const response = await fetch(`http://localhost:8000/api/books/${id}`);
      // Check if the response is successful
      if (!response.ok) throw new Error("Failed to fetch book details");
      // Parse the JSON response
      const data = await response.json();
      // Update the book state with fetched data
      setBook(data);
    } catch (err) {
      // Store error message if the request fails
      setError(err.message);
    }
    // Set loading to false regardless of success or failure
    setLoading(false);
  };

  // Handle changes in form input fields
  const handleChange = (e) => {
    // Destructure name and value from the event target
    const { name, value } = e.target;
    // Update formData state while preserving other field values
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update only the changed field
    }));
  };

  // Handle form submission to reserve a book
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Set loading state to show processing indicator
    setLoading(true);
    // Clear any previous errors
    setError(null);
    try {
      // Log form data for debugging
      console.log("FormDataSent is ", formData);
      // Send POST request to reserve the book
      const response = await fetch(
        `http://localhost:8000/api/books/${id}/reserve`,
        {
          method: "POST", // Use POST method for creating a reservation
          headers: { "Content-Type": "application/json" }, // Set content type to JSON
          body: JSON.stringify(formData), // Convert form data to JSON string
        }
      );
      // Check if the response is successful
      if (!response.ok) throw new Error("Reservation failed");
      // Parse the JSON response
      const updatedBook = await response.json();
      // Update the book state with the updated data (now including booker info)
      setBook(updatedBook);
    } catch (err) {
      // Store error message if the request fails
      setError(err.message);
    }
    // Set loading to false regardless of success or failure
    setLoading(false);
  };

  // Render the component UI
  return (
    // Use the Layout component for consistent page structure
    <Layout title="Book Detail">
      <div className="container mx-auto px-4 py-8">
        {/* Conditional rendering based on whether book data is loaded */}
        {!book ? (
          // Show this if book data hasn't been loaded yet
          <div className="text-center">
            {/* Display error message if there is one */}
            {error && <p className="text-red-500">{error}</p>}
            {/* Button to fetch book details */}
            <button
              onClick={handleGetDetails}
              className="bg-blue-500 text-white p-2 rounded-md"
              disabled={loading} // Disable button while loading
            >
              {/* Change button text based on loading state */}
              {loading ? "Loading..." : "Get Details"}
            </button>
          </div>
        ) : (
          // Show this if book data is loaded
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Display book title */}
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            {/* Display book description */}
            <p className="text-gray-700 mb-4">{book.description}</p>
            {/* Display book metadata */}
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

            {/* Conditional rendering based on whether book is already booked */}
            {book.booker_name ? (
              // Show this if book is already booked
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-lg font-semibold text-yellow-700">
                  Booked by: {book.booker_name}
                </h3>
                <p className="text-yellow-600">
                  Contact Email: {book.booker_email}
                </p>
              </div>
            ) : (
              // Show booking form if book isn't booked yet
              <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Reserve this book:
                </h3>
                {/* Name input field */}
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
                {/* Email input field */}
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
                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded-md"
                  disabled={loading} // Disable while loading
                >
                  {/* Change button text based on loading state */}
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

// Export the component for use in other parts of the application
export default BookDetail;
