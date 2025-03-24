import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// set routing api, or let vercel handle local routing
const apiUrl = process.env.REACT_APP_API_URL || "";

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
        {/* title for homepage */}
        <div className="text-wrapper">
          <h1 className="front-title">Bit by Bit Recipes</h1>
          <h1 className="back-title">Bit by Bit Recipes</h1>
        </div>

        {/* overall text box */}
        <div className="text-box">
          {/* welcome box and text */}
          <div className="welcome-box">
            <p className="welcome-text">Welcome! Please enter your username and password! (:</p>
          </div>
          
          {/* username title and input box */}
          <p className="user-pass-text">Username</p> 
          <input 
            type="text"
            value={userInput} // contains user input
            onChange={(e) => setUserInput(e.target.value)} 
            className="input-field"
            placeholder="Enter your username"
          />

          {/* password title and input box */}
          <p className="user-pass-text">Password</p>
          <input
            className="input-field"
            placeholder="Enter your password"
          />
        </div>

        {/* submit button */}
        <form className="form-box" onSubmit={handleSubmit}>
          <button className="button-box" type="submit">
            Submit
          </button>
        </form>

        {/* outputs success or not for user authentication */}
        <h1>User Authentication: {userInputResponse}</h1>
      </header>
    </div>
  );
}

export default App;
