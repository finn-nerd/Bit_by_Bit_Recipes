import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Homepage() {
  const [search_input, setSearch_Input] = useState('');
  const [userInputResponse, setUserInputResponse] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch meal data from backend
  const fetchMeals = async (query = "chicken") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals?category=${query}`);
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      setMeals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeals(); // default category
  }, []);

  const handleEnter = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search_input })
      });
      const data = await response.json();

      if (response.ok) {
        setUserInputResponse('Successful search attempt!');
      } else {
        setUserInputResponse(data.message || 'Failed to search a recipe.');
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      setUserInputResponse("An error occurred while contacting the server.");
    }
  };

  const handleClick = () => router.push('/login');

  return (
    <div className="App">
      {/* Left filter bar */}
      <div className="fixed left-0 w-[10%] h-[100%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-0"></div>

      {/* Top bar */}
      <div className="fixed top-0 w-[100%] bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-1">
        <div className="flex items-center my-5">
          <button className="bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10']">
            User
          </button>

          <input
            type="text"
            value={search_input}
            onChange={(e) => setSearch_Input(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEnter(e);
              }
            }}
            className="relative bg-[#E65340] text-black text-base sm:text-lg md:text-xl lg:text-[35px] w-full max-w-[70%] mx-15 pl-10 p-3 rounded-[25px] border-[4px] border-[#C13737] font-['Jersey_10'] z-2"
            placeholder="Search for a recipe here..."
          />

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] mx-3 text-white font-['Jersey_10']">My Kitchen</h1>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="flex flex-wrap justify-start mt-[180px] px-10 pl-[12%] gap-10">

        {loading ? (
          <p className="text-white text-2xl font-bold">Loading...</p>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="aspect-[4/3] w-[300px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] text-center"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-40 object-cover rounded-[12px] mb-3"
              />
              <p className="text-white font-['Jersey_10'] text-xl">{meal.strMeal}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-2xl font-bold">No meals found</p>
        )}
      </div>

      {/* Return to login button */}
      <div className="flex justify-center flex-col items-center my-10">
        <button
          className="bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-[55px] p-5 rounded-[20px] border-[6px] border-[#B21F1F] font-['Jersey_10']"
          type="button"
          onClick={handleClick}
        >
          Return to Login Page
        </button>
      </div>
    </div>
  );
}

export default Homepage;
