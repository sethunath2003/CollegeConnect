//TODO:ADD SIMILAR FUCTIONS AD VIEWS FOR SERVICES AND ABOUT BUTTONS
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showContactModal, setShowContactModal]=useState(false);
  const [contactForm, setContactForm]=useState({
    name:"",
    email:"",
    message:""
  });   
  const[submitStatus, setSubmitStatus]=useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const handleContactClick=()=>{
    setShowContactModal(true);
  };

  const handleContactClose=()=>{
    setShowContactModal(false);
    setSubmitStatus(null);
  }
   
  const handleContactChange=(e)=>{
    const {name, value }=e.target;
    setContactForm((prev) =>({
        ...prev,
        [name]:value,

    }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/contact/", conatctForm);
            console.log(response.data);
            if (response.status === 201) {
                setSubmitStatus("success");
                setTimeout(() => {
                    setContactForm({
                        name: "",
                        email: "",
                        message: "",
                    });
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to submit contact form:", error);
            setSubmitStatus("error");
        }
    };


  return (
    <>
    <header className="bg-gray-900 text-white p-4 flex items-center w-full relative">
      <div className="absolute left-4">
        <Link to="/">
          <h2 className="text-3xl font-bold">CollegeConnect</h2>
        </Link>
      </div>

      <div className="flex mx-auto space-x-4">
        <Link to="/">
          <button className="px-4 py-2 hover:bg-gray-800 rounded-md">
            Home
          </button>
        </Link>
        <button className="px-4 py-2 hover:bg-gray-800 rounded-md">
          About
        </button>
        <button className="px-4 py-2 hover:bg-gray-800 rounded-md">
          Services
        </button>
        <button className="px-4 py-2 hover:bg-gray-800 rounded-md" onClick={handleContactClick}>
          Contact
        </button>
      </div>

      {isLoggedIn ? (
        <div className="absolute right-4 flex items-center">
          <div className="mr-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="text-white mr-4">{username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="absolute right-4 flex">
          <Link to="/login">
            <button className="px-5 py-2 bg-gray-700 text-white rounded mr-4 hover:bg-gray-600">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </header>

    {showContactModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={handleContactClose}
        >
          <div
            className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h3>
            
            {submitStatus === "success" ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : submitStatus === "error" ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Failed to send message. Please try again later.
              </div>
            ) : null}
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-1">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={handleContactClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
