import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
// Import components
import Layout from "./components/Layout";
import About from "./pages/About"
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import BookList from "./modules/Books/BookList";
import BookDetail from "./modules/Books/BookDetail";
import BookPost from "./modules/Books/BookPost";
import LetterDraft from "./modules/Letters/LetterDraft";
import Services from "./pages/Services";
import BookedByMe from "./modules/Books/BookedByMe";
import PostedByMe from "./modules/Books/PostedByMe";
import EventsPage from "./pages/EventsPage";
import ViewDrafts from "./modules/Letters/ViewDrafts";
import EditDraft from "./modules/Letters/EditDraft";

function App() {
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user activity and handle auto-logout
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    const updateActivity = () => setLastActivity(Date.now());

    events.forEach((event) => window.addEventListener(event, updateActivity));

    const checkInactivity = setInterval(() => {
      if (
        Date.now() - lastActivity > INACTIVITY_TIMEOUT &&
        localStorage.getItem("token")
      ) {
        // Logout user
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        window.dispatchEvent(new Event("storage"));
        alert("You have been logged out due to inactivity..");
        window.location.href = "/login";
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity)
      );
      clearInterval(checkInactivity);
    };
  }, [lastActivity]);

  // Set up authentication interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Layout />
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
         
          <Route path="/letter-drafting" element={<LetterDraft />} />
          <Route path="/bookexchange" element={<BookList />} />
          <Route path="/bookexchange/post" element={<BookPost />} />
          <Route path="/bookexchange/book/:id" element={<BookDetail />} />
          <Route path="/bookexchange/booked" element={<BookedByMe />} />
          <Route path="/bookexchange/posted" element={<PostedByMe />} />
          <Route path="/services" element={<Services />} />
          <Route path="/eventlister" element={<EventsPage />} />
          <Route path="/drafts" element={<ViewDrafts />} />
          <Route path="/edit-draft/:draftId" element={<EditDraft />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
