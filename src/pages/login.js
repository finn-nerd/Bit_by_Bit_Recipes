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
            router.push('/homepage')
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

        {/* blocks for background aesthetics */}
        <div className="fixed top-0 left-0 w-[35%] h-[10%] bg-[#F05353] z-0"></div>
        <div className="fixed top-0 right-0 w-[35%] h-[10%] bg-[#F05353] z-0"></div>
        <div className="fixed bottom-0 left-0 w-[35%] h-[10%] bg-[#F05353] z-0"></div>
        <div className="fixed bottom-0 right-0 w-[35%] h-[10%] bg-[#F05353] z-0"></div>

        <div className="fixed top-[10%] left-0 w-[30%] h-[15%] bg-[#F07853] z-0"></div>
        <div className="fixed top-[10%] right-0 w-[30%] h-[15%] bg-[#F07853] z-0"></div>
        <div className="fixed bottom-[10%] left-0 w-[30%] h-[15%] bg-[#F07853] z-0"></div>
        <div className="fixed bottom-[10%] right-0 w-[30%] h-[15%] bg-[#F07853] z-0"></div>

        <div className="fixed top-[25%] left-0 w-[25%] h-[15%] bg-[#F09053] z-0"></div>
        <div className="fixed top-[25%] right-0 w-[25%] h-[15%] bg-[#F09053] z-0"></div>
        <div className="fixed bottom-[25%] left-0 w-[25%] h-[15%] bg-[#F09053] z-0"></div>
        <div className="fixed bottom-[25%] right-0 w-[25%] h-[15%] bg-[#F09053] z-0"></div>

        <header className="App-header">
          <div className="relative flex items-center justify-center">
            {/* left floating pizza */}
            <img className="absolute left-[-60px] sm:left-[-80px] w-[50px] sm:w-[70px] animate-[float_infinite_2s] z-1" 
            src="/pizza.png" 
            alt="Pizza"/>
            
            {/* title for page */}
            <div className="relative inline-block">
                <h1 className="relative z-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[70px] font-['Jersey_10']">Bit by Bit Recipes</h1>
                <h1 className="absolute z-0 text-[#D35E2C] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[70px] whitespace-nowrap top-[0.1em] right-[0.1em] font-['Jersey_10']">Bit by Bit Recipes</h1>
            </div>

            {/* right floating pizza */}
            <img className="absolute right-[-60px] sm:right-[-80px] w-[50px] sm:w-[70px] animate-[float_infinite_2s] z-1" 
            src="/pizza.png" 
            alt="Pizza"/>
          </div>
          
          {/* overall text box */}
          <div className="w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[45%] max-w-[800px] h-auto mt-5 mb-5 mx-auto p-5 rounded-[20px] border-8 border-solid border-[#C13D00] bg-gradient-to-b from-[#f18d5e] to-[#ef6f34]">
              {/* welcome box and text */}
              <div className="bg-[#E65340] w-full sm:w-[90%] md:w-[75%] lg:w-[650px] h-auto m-auto p-4 rounded-[10px] border-4 border-solid border-[#C13737]">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-[35px] mt-0 text-center">
                  Welcome! Please enter your username and password! (:
                </p>
              </div>

              {/* button to go to create account page */}
              <button className="bg-[#EB4B4B] w-full sm:w-auto h-auto flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-[25px] text-white mt-5 mb-5 mx-auto px-5 py-2 rounded-[10px] border-4 border-solid border-[#B21F1F] font-['Jersey_10']"
                type="button" 
                onClick={handleClick}>
                  If you're new, please create an account by clicking here!
              </button>
              
              {/* username title and input box */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-tight">Username</p> 
              <input 
                  type="username"
                  value={username} // contains username
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-[#F3E0A9] text-black text-base sm:text-lg md:text-xl lg:text-[25px] w-full max-w-[350px] text-center mb-2.5 p-2 rounded-[10px] border-[3px] border-solid border-[#D28B4E] font-['Jersey_10']"
                  placeholder="Enter your username"
              />

              {/* password title and input box */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-tight">Password</p>
              <input
                  type="password"
                  value={password} // contains password
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-[#F3E0A9] text-black text-base sm:text-lg md:text-xl lg:text-[25px] w-full max-w-[350px] text-center mb-2.5 p-2 rounded-[10px] border-[3px] border-solid border-[#D28B4E] font-['Jersey_10']"
                  placeholder="Enter your password"
              />
          </div>

          {/* submit button to check user authentication*/}
          <form className="flex justify-center flex-col items-center" onSubmit={handleSubmit}>
              {/* submit button to check user authentication*/}
              <button className="bg-[#EB4B4B] w-auto h-auto flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-[55px] text-[white] p-5 rounded-[20px] border-[6px] border-solid border-[#B21F1F] font-['Jersey_10']"
                type="submit">
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
