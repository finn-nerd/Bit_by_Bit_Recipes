import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Homepage() {

        // variables
        const [search_input, setSearch_Input] = useState('');
        const router = useRouter(); // used to navigate to diff pages
    
        // send input to backend/api
        const handleEnter = async (e) => {
            e.preventDefault();
          
            try {
              const response = await fetch('/api/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search_input })
              });
              const data = await response.json();
              
              // Login successful
              if (response.ok) {
                setUserInputResponse('Successful search attempt!')
              } else {
                setUserInputResponse(data.message || 'Failed to search a recipe.');
              }
            } catch (err) {
              console.error("Error during fetch:", err);
              setUserInputResponse("An error occurred while contacting the server.");
            }
          };

        // used to navigate to diff page
        const handleClick = () => router.push('/login');

    return (
        <div className="App">
            {/* background for ingredient filter */}
            <div className="fixed left-0 w-[10%] h-[100%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-0"></div>

                {/* background for search bar */}
                <div className="fixed top-0 w-[100%] bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-1">
                    <div className="flex items-center my-5"> 
                        {/* button for user profile */}
                        <button className="bg-[#EB4B4B] w-auto h-auto flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] lg:text-[40px] text-white mx-10 px-5 py-3 rounded-[20px] border-[4px] border-solid border-[#B21F1F] font-['Jersey_10']">
                            User
                        </button>

                        {/* search bar */}
                        <input 
                            type="search_input"
                            value={search_input}
                            onChange={(e) => setSearch_Input(e.target.value)} 
                            // when user presses enter, sends search_input to backend 
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleEnter(e);
                                }
                            }}
                            className="relative bg-[#E65340] text-black text-base sm:text-lg md:text-xl lg:text-[35px] w-full max-w-[70%] mx-15 pl-10 p-3 rounded-[25px] border-[4px] border-solid border-[#C13737] font-['Jersey_10'] z-2"
                            placeholder="Search for a recipe here..."
                        />

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] mx-3 text-white font-['Jersey_10']">My Kitchen</h1>
                    </div>
                </div>

                {/* card template */}
                {/* can do logic: auto fill row and do a for loop to generate same row with different recipes */}
                <div className="flex items-center ml-[15%] pt-[170px]">
                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00]">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>
                </div>

                <div className="flex items-center ml-[15%] mt-20">
                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00]">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>
                </div>

                <div className="flex items-center ml-[15%] mt-20">
                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] mr-30">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>

                    <div className="aspect-[4/3] w-full max-w-[400px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00]">
                        <p className="text-white font-['Jersey_10']">This is a test card!</p>
                    </div>
                </div>

                {/* click button to return to login page */}
                <div className="flex justify-center flex-col items-center">
                    <button className="bg-[#EB4B4B] w-auto h-auto flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-[55px] text-[white] p-5 rounded-[20px] border-[6px] border-solid border-[#B21F1F] font-['Jersey_10']"
                     type="button" 
                     onClick={handleClick}>
                        Return to Login Page
                    </button>
                </div>
        </div>
    );  

}

export default Homepage;
