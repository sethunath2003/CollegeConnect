import { useState } from 'react'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
    </Routes>
</Router>
  )
}

export default App;
