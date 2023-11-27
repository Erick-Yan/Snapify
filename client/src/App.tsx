import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import LandingPage from "./Pages/LandingPage"
import UserProfilePage from './Pages/UserProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<LandingPage />} />
        <Route path="/app/:userId/profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
