import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAcct() {

// variables
const navigate = useNavigate(); // used to navigate to diff pages

// used to navigate to diff page
const handleClick = () => navigate('/');

return (
    <div className="App">
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

export default CreateAcct;