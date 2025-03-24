import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import CreateAcct from './CreateAcct';

// set routing api, or let vercel handle local routing
const apiUrl = process.env.REACT_APP_API_URL || "";

function App() {
  return (
    <Router>
      <Routes>
        {/* routes for diff pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/create_account" element={<CreateAcct />} />
      </Routes>
    </Router>
  );
}

export default App;
