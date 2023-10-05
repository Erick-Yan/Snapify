import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import LandingPage from "./Pages/LandingPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
