import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Homepage";
import LetterDraft from "./pages/LetterDraft";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookPost from "./pages/BookPost";
import LetterDrafts from "./pages/LetterDrafts";
import EditDraft from "./pages/EditDraft";
import BookDetail from "./pages/BookDetail";
import BookList from "./pages/BookList"; // Add this import
import PostBook from "./components/PostBook"; // Add this import
import Services from "./pages/Services";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Layout />
        <div >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/letter-drafting" element={<LetterDraft />} />
            <Route path="/bookexchange" element={<BookList />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            {/* Add this route */}
            <Route path="/bookexchange/post" element={<BookPost />} />
            <Route path="/letter-draft" element={<LetterDraft />} />
            <Route path="/drafts" element={<LetterDrafts />} />
            <Route path="/edit-draft/:draftId" element={<EditDraft />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/post-book" element={<PostBook />} />{" "}
            {/* Add this route */}
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
