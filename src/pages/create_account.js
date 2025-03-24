import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function CreateAccount() {

    // variables
    const [username, setUsername] = useState(''); // stores username
    const [password, setPassword] = useState(''); // stores username
    const [userInputResponse, setUserInputResponse] = useState(''); // stores response from server
    const router = useRouter(); // set up router

    // send input to backend/api
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          // Send registration data to the registration endpoint
          const response = await fetch('/api/create_account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          
          if (response.status === 201) {
            // Account was created successfully, so redirect to the login page
            router.push('/login');
          } else {
            setUserInputResponse(data.message || 'Failed to create account.');
          }
        } catch (err) {
          console.error("Error during fetch:", err);
          setUserInputResponse("An error occurred while contacting the server.");
        }
      };
      
    const handleClick = () => router.push('/login');

    return (
        <div className="App">
            {/* blocks for background aesthetics */}
            <div className="red-block" style={{top: '0px', left: '0px'}}></div>
            <div className="red-block" style={{top: '0px', right: '0px'}}></div>
            <div className="red-block" style={{bottom: '0px', left: '0px'}}></div>
            <div className="red-block" style={{bottom: '0px', right: '0px'}}></div>

            <div className="red-orange-block" style={{top: '100px', left: '0px'}}></div>
            <div className="red-orange-block" style={{top: '100px', right: '0px'}}></div>
            <div className="red-orange-block" style={{bottom: '100px', left: '0px'}}></div>
            <div className="red-orange-block" style={{bottom: '100px', right: '0px'}}></div>

            <div className="orange-block" style={{top: '230px', left: '0px'}}></div>
            <div className="orange-block" style={{top: '230px', right: '0px'}}></div>
            <div className="orange-block" style={{bottom: '230px', left: '0px'}}></div>
            <div className="orange-block" style={{bottom: '230px', right: '0px'}}></div>

            <header className="App-header">
                {/* title for page */}
                <div className="text-wrapper">
                    <h1 className="front-title">Bit by Bit Recipes</h1>
                    <h1 className="back-title">Bit by Bit Recipes</h1>
                </div>

                {/* overall text box */}
                <div className="text-box">
                    {/* welcome box and text */}
                    <div className="welcome-box">
                        <p className="welcome-text">
                            Please create an account by entering your new username and password!
                        </p>
                    </div>
                    
                    {/* username title and input box */}
                    <p className="user-pass-text">Username</p> 
                    <input 
                        type="username"
                        value={username} // contains username
                        onChange={(e) => setUsername(e.target.value)} 
                        className="input-field"
                        placeholder="Enter your username"
                    />

                    {/* password title and input box */}
                    <p className="user-pass-text">Password</p>
                    <input
                        type="password"
                        value={password} // contains password
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input-field"
                        placeholder="Enter your password"
                    />

                    {/* submit button to check user authentication*/}
                    <form className="form-box" onSubmit={handleSubmit}>
                        {/* submit button to check user authentication*/}
                        <button className="smaller-button" type="submit">
                            Submit your new username and password!
                        </button>
                    </form>
                </div>

                {/* submit button to check user authentication*/}
                <form className="form-box">
                    <button className="button-box" type="submit" onClick={handleClick}>
                        Return of Login Page
                    </button>
                </form>
            </header>
        </div>
    );


}

export default CreateAccount;