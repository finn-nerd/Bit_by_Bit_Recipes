import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  // creates state variables
  const [apiResponse, setApiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [userInputResponse, setUserInputResponse] = useState('');

  // runs function once and makes a GET request to the following link
  useEffect(() => {
    fetch(`${apiUrl}/api/testAPI`)
      // converts response into plain text
      .then((res) => res.text())
      // stores response in variable
      .then((res) => setApiResponse(res));
  }, []);

  // send input to backend/api
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    // send to server and record response
    const response = await fetch(`${apiUrl}/api/client-side-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput })
    });

    // output response on frontend
    const data = await response.json(); // parse json stream into object
    setUserInputResponse(data.message); // extract json "message" field
    } catch (err) {
      console.error("Error during fetch:", err);
      setUserInputResponse("An error occurred while contacting the server.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>React + Express Test</h1>

        <p>API Response: {apiResponse}</p>

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter something"
          />
          
          <button type="submit">submit</button>
        </form>

        <p>User Input Response: {userInputResponse}</p>
      </header>
    </div>
  );
}

export default App;
