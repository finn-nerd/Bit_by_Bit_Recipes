import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // creates a state variable
  const [apiResponse, setApiResponse] = useState('');

  // runs function once and makes a GET request to the following link
  useEffect(() => {
    fetch('http://localhost:9000/testAPI')
      // converts response into plain text
      .then((res) => res.text())
      // stores response in variable
      .then((res) => setApiResponse(res));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          React + Express Test
        </h1>
        <p>
          API Response: {apiResponse}
        </p>
      </header>
    </div>
  );
}

export default App;
