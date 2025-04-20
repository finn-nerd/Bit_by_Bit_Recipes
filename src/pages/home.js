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

  // Create list of favorited meals
  const [favorites, setFavorites] = useState([]); // or useState(new Set())

    useEffect(() => {
        fetchFavorites();
    }, []);

    // Find currently favorited meals
    const fetchFavorites = async () => {
        // TODO:
        // find all favorite meal ids
        // populate the 'favorites' list with it

        // dummy data for now
        setFavorites(['52772', '52874', '52913']);
    };

    // Favorite a meal
    const toggleFavorite = (mealID) => {
        const isNowFav = !favorites.includes(mealID)
        setFavorites((prev) =>
            isNowFav ? [...prev, mealID] : prev.filter((id) => id !== mealID)
        );
        
        console.log(`FAVORITED ${mealID}: ${isNowFav}`);
        // TODO:
        // update backend copy of favorites list
        // if (isNowFav) --> add it to db
        // else --> delete it from db
    };

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

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] mx-3 text-white font-['Jersey_10']">My Kitchen</h1>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="flex flex-wrap justify-center mt-[180px] px-10 pb-10 pl-[12%] gap-10">

        {loading ? (
          <p className="text-white text-2xl font-bold">Loading...</p>
        ) : meals.length > 0 ? (
          meals.map((meal) => {
            const isFav = favorites.includes(meal.idMeal);
            return (
                <div
                key={meal.idMeal}
                onClick={() => handleRedirect(meal.idMeal)}
                className="cursor-pointer relative h-60 aspect-[4/3] w-[280px] rounded-[20px] bg-[#E76A30] shadow-[0_12px_24px_rgba(0,0,0,0.4)] text-center group"
                >
                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onClick of the card
                        toggleFavorite(meal.idMeal);  // Send meal to backend to be favorited/unfavorited
                    }}
                    className="cursor-pointer absolute top-2 right-2 transform -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-6 h-6 text-yellow-400 ${isFav ? 'fill-current' : 'fill-none'} stroke-current stroke-2`}
                    >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                </button>
                {/* Recipe Image */}
                <div className="flex-1" style={{ height: '65%' }}>
                    <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-full h-full object-cover rounded-t-[12px]"
                    />
                </div>
                {/* Recipe Title */}
                <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ height: '35%' }}>
                    <p className="text-white font-['Jersey_10'] p-3 text-2xl line-clamp-2">{meal.strMeal}</p>
                </div>
                </div>
                )
            }
          )
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
