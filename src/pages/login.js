import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// set routing api, or let vercel handle local routing

function Login() {

    // variables
    // const [apiResponse, setApiResponse] = useState('');
    const [username, setUsername] = useState(''); // stores username
    const [password, setPassword] = useState(''); // stores username
    const [userInputResponse, setUserInputResponse] = useState(''); // stores response from server
    const router = useRouter(); // used to navigate to diff pages

    // send input to backend/api
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          
          // Login successful
          if (response.ok) {
            setUserInputResponse(data.message);
            // redirect to home page here (when ready)
          } else {
            setUserInputResponse(data.message || 'Login failed');
          }
        } catch (err) {
          console.error("Error during fetch:", err);
          setUserInputResponse("An error occurred while contacting the server.");
        }
      };
      

    // used to navigate to diff page
    const handleClick = () => router.push('/create_account');

    return (
    <div className="App">
        {/* floating pizza */}
        <img className="floating pizza" style={{top: '50px', left: '500px'}} src="/pizza.png" alt="Pizza" />
        <img className="floating pizza" style={{top: '50px', right: '500px'}} src="/pizza.png" alt="Pizza" />

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
                    <p className="welcome-text">Welcome! Please enter your username and password! (:</p>
                </div>

                {/* button to go to create account page */}
                <button className="smaller-button" type="button" onClick={handleClick}>
                    If you're new, please create an account by clicking here!
                </button>
                
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
            </div>

            {/* submit button to check user authentication*/}
            <form className="form-box" onSubmit={handleSubmit}>
                {/* submit button to check user authentication*/}
                <button className="button-box" type="submit">
                    Login
                </button>
            </form>

            {/* outputs success or not for user authentication */}
            {/* marginTop is for style/structure on page and i dont want to create a css class for this */}
            <h1 style={{marginTop: '30px'}}>User Authentication: {userInputResponse}</h1>
        </header>
    </div>
    );
}

export default Login;
