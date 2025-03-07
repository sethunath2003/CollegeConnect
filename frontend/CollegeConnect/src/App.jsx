import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Homepage";
import LetterDraft from "./pages/LetterDraft";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/letter-drafting" element={<LetterDraft />} />
        {/* <Route path="/forgot-password" element={<div>Forgot Password</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
