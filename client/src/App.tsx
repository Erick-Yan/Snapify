import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import LandingPage from "./Pages/LandingPage"
import UserProfilePage from './Pages/UserProfilePage';
import UserProfilePublicPage from './Pages/UserProfilePublicPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<LandingPage />} />
        <Route path="/app/profile/:userId" element={<UserProfilePage />} />
        <Route path="/app/public/:publicId" element={<UserProfilePublicPage />} />
      </Routes>
    </Router>
  );
}

export default App;
