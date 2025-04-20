import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/sidebar'

function Home() {
  const router = useRouter();
  const [search_input, setSearch_Input] = useState('');
  const [userInputResponse, setUserInputResponse] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false); // sidebar isnt open by default

  // Fetch meal data from backend
  const fetchMeals = async (query = 'chicken') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals?recipe=${query}`);

      // if category doesn't exist
      if (!res.ok) {
        const error = await res.json();
        setUserInputResponse(error.message || 'No meals found.');
        setMeals([]);
        setLoading(false);
        return;
      }

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
    fetchMeals(search_input);
  };

  const handleRedirect = (recipeID) => {
    router.push(`/recipes/${recipeID}`);
  }

  const toggleSidebar = () => setOpenSidebar(!openSidebar);
  const closeSidebar = () => setOpenSidebar(false);

  const handleClick = () => router.push(`/my_kitchen`)

  return (
    <div className="App">

      {/* Left filter bar */}
      <div className="fixed left-0 w-[10%] h-[100%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-1"></div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-10">
        <div className="flex items-center my-5">
          <button 
          onClick={toggleSidebar} // if user clicks button, open sidebar
          className="bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10'] z-20">
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
            className="relative bg-[#E65340] text-black text-base sm:text-lg md:text-xl lg:text-[35px] w-full max-w-[70%] mx-15 pl-10 p-3 rounded-[25px] border-[4px] border-[#C13737] font-['Jersey_10'] z-20"
            placeholder="Search for a recipe here..."
          />

          <button 
          onClick={handleClick}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] mx-3 text-white font-['Jersey_10']">
            My Kitchen
          </button>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="flex flex-wrap justify-center mt-[180px] px-10 pb-10 pl-[12%] gap-10">

        {loading ? (
          <p className="text-white text-2xl font-bold">Loading...</p>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              onClick={() => handleRedirect(meal.idMeal)}
              className="cursor-pointer aspect-[4/3] w-[280px] p-5 rounded-[20px] bg-[#E76A30] border-[4px] border-[#C13D00] text-center"
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
          <p className="text-white text-2xl font-bold">{userInputResponse}</p>
        )}
      </div>

        {/* sidebar */}
        <Sidebar isOpen={openSidebar} isClose={closeSidebar} />

    </div>
  );

}

export default Home;
