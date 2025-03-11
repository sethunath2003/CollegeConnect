import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Homepage";
import LetterDraft from "./pages/LetterDraft";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookPost from "./pages/BookPost";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/letter-drafting" element={<LetterDraft />} />
            <Route path="/bookexchange/post" element={<BookPost />} />
          </Routes>
        </div>
        <footer className="bg-gray-900 text-white p-4 text-center mt-auto">
          <div className="footer-text">
            © {new Date().getFullYear()} College Connect. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
