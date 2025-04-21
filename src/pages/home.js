import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/sidebar'
import { Listbox } from '@headlessui/react';
import { parseCookies } from 'nookies';

export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx);

    // Pass token status as a prop to the page
    return {
        props: { isLoggedIn: Boolean(token) },
    };
}

function Home({ isLoggedIn }) {
  const router = useRouter();
  const [userInputResponse, setUserInputResponse] = useState('');

  // search bar
  const [search_input, setSearch_Input] = useState(''); // search bar input

  // fetch meals
  const [meals, setMeals] = useState([]); // meal cards
  const [loading, setLoading] = useState(false);

  // category dropdown menu
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(''); 

  // area dropdown menu
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(''); 

  // ingredient search bar
  const [search_ing, setSearch_Ing] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  // side bar
  const [openSidebar, setOpenSidebar] = useState(false); // sidebar isnt open by default

  // Create list of saved meals
  const [savedMeals, setSavedMeals] = useState([]); // or useState(new Set())

  useEffect(() => {
    fetchMeals(); // default category
    fetchSavedMeals();
    fetchCats();
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchMeals()
  }, [selectedArea, selectedCat, filteredIngredients]);

    // Find currently saved meals
    const fetchSavedMeals = async () => {
        if (isLoggedIn) {
            try {
                const res = await fetch('/api/fetch_saved_meals');
                if (!res.ok) throw new Error(await res.text());
                const { savedMeals } = await res.json();
                setSavedMeals(savedMeals.map(m => m.mealID));
            } catch (err) {
                console.error('Could not load saved recipes:', err);
            }
        }
        else setSavedMeals([]);
    };

    // Favorite a meal
    const toggleSavedMeal = (meal) => {
        // Update local copy of saved IDs
        const isNowSaved = !savedMeals.includes(meal.idMeal)
        setSavedMeals((prev) =>
            isNowSaved ? [...prev, meal.idMeal] : prev.filter((id) => id !== meal.idMeal)
        );
        // Update DB
        updateSavedMeals(meal.idMeal, meal.strMeal, meal.strMealThumb, isNowSaved);
    };

    const updateSavedMeals = async (mealID, mealName, mealThumbnail, mealIsSaved) => {
        try {
            const res = await fetch('/api/update_saved_meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mealID,         // ID of the meal
                    mealName,       // Name of the meal
                    mealThumbnail,  // Thumbnail image URL
                    mealIsSaved     // Boolean
                }),
            });
    
            // Handle non-OK response
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
    
            const data = await res.json();
            console.log(data.message); // "Successfully saved meal {mealID}: {mealName}"
    
        } catch (err) {
            console.error('Error saving meal:', err);
        }
    }

  // Fetch meal data from backend
  const fetchMeals = async (query = '') => {
    setLoading(true);    
    
    try {
        const res = await fetch('/api/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, selectedCat, selectedArea, filteredIngredients })
        });

      // if category doesn't exist
      if (!res.ok) {
        const error = await res.json();
        setUserInputResponse(error.message || 'No meals found.');
        setMeals([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMeals(data || []);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      setMeals([]);
    }
    setLoading(false);
  };

  // Fetch categories for dropdown menu
  const fetchCats = async (query) => {
    try {
      const res = await fetch(`/api/categories`);
      const data = await res.json();

      const categoryNames = ['Any', ...data.meals.map((cat) => cat.strCategory)];
      setCategories(categoryNames);
    } catch (err) {
      console.error("Failed to categories:", err);
      setCategories([]);
    }
  };
  // for category selection from filter bar
  const handleSelectCat = (value) => {
    setSelectedCat((value === 'Any' ? null : value));
  }

  // Fetch categories for dropdown menu
  const fetchAreas = async (query) => {
    try {
      const res = await fetch(`/api/areas`);
      const data = await res.json();

      const areaNames = ['Any', ...data.meals.map((area) => area.strArea)];
      setAreas(areaNames);
    } catch (err) {
      console.error("Failed to areas:", err);
      setAreas([]);
    }
  };

  // for area selection from filter bar
  const handleSelectArea = (value) => {
    setSelectedArea((value === 'Any' ? null : value));
  }

  // search bar enter
  const handleEnter = async (e) => {
    e.preventDefault();
    fetchMeals(search_input);
  };

  // search bar enter for ingredients
  const handleEnterIng = async (e) => {
    e.preventDefault();
    const trimmed = search_ing.trim();
    if (e.key === 'Enter' && trimmed && !filteredIngredients.includes(trimmed)) {
        setFilteredIngredients([...filteredIngredients, trimmed]);
        setSearch_Ing(''); // clear input
    }
  };

  const removeIngredient = (ingredient) => {
    setFilteredIngredients(prev => prev.filter(item => item !== ingredient));
  };

  // clicking on a meal card
  const handleRedirect = (recipeID) => {
    router.push(`/recipes/${recipeID}`);
  }

  // random meal button
  const handleRandom = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        router.push(`/recipes/${data.meals[0].idMeal}`);
    } catch (error) {
        console.error('Error fetching random meal:', error);
    }
  }

  // sidebar
  const toggleSidebar = () => setOpenSidebar(!openSidebar);
  const closeSidebar = () => setOpenSidebar(false);

  const handleClick = () => router.push(`/my_kitchen`)

  return (
    <div className="App">

      {/* Top bar */}
      <div className="py-1 top-0 left-0 w-full bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-10">
        <div className="flex flex-row gap-3 items-center my-5">
          <button 
          onClick={toggleSidebar} // if user clicks button, open sidebar
          className="cursor-pointer bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10'] z-20">
            Settings
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
            className="relative ml-auto bg-[#E65340] text-black text-base sm:text-lg md:text-xl lg:text-[35px] w-full max-w-[50%] pl-10 p-3 rounded-[25px] border-[4px] border-[#C13737] font-['Jersey_10'] z-20"
            placeholder="Search for a recipe here..."
          />

            {/* Random Recipe */}
            <button className="cursor-pointer p-2 hover:scale-105 transition-transform ml-auto btn-active no-shadow"
            onClick={handleRandom}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
            </button>

            {/* Refresh Recipes */}
            <button className="cursor-pointer p-2 ml-auto flex items-center justify-center no-shadow"
            onClick={() => fetchMeals()}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                    <polyline points="22.5 6 22.5 12 17.5 12" />
                    <path d="M20.49 15A9 9 0 1 1 21 12" />
                </svg>
            </button>

          <button 
          onClick={handleClick}
          className="cursor-pointer ml-auto bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10']">
            My Kitchen
          </button>
        </div>
      </div>

      {/* Rest of the page */}
      <div className="flex flex-row flex-grow min-h-screen">
        {/* Left filter bar */}
        <div className="py-1 overflow-y-auto scrollbar-hide w-[13%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-1 flex flex-col items-center pt-5">

          <p className="text-xl sm:text-2xl xl:text-[25px] text-black font-['Jersey_10']">Choose a Category: </p>

          {/* Dropdown menu for categories */}
          <Listbox
          as='div'
          value={selectedCat}
          onChange={handleSelectCat}>

            {/* Dropdown button */}
            <Listbox.Button className="w-full cursor-pointer text-xl sm:text-2xl xl:text-[22px] text-black py-3 focus:outline-none opacity-[60%] font-['Jersey_10']">
              {selectedCat || 'Any'}
            </Listbox.Button>

            {/* Dropdown options */}
            <Listbox.Options>
              {categories.map((category, index) => (
                <Listbox.Option
                key={index}
                value={category}
                className={({active}) =>
                  `cursor-pointer select-none p-2 ${active ? 'bg-[#EF6F34] text-black' : ''}`}
                >
                  {category}
                </Listbox.Option>
              ))}
            </Listbox.Options>
            
          </Listbox>

          <p className="text-xl sm:text-2xl xl:text-[25px] text-black pt-5 font-['Jersey_10']">Choose an Area: </p>

          {/* Dropdown menu for area */}
          <Listbox
          as='div'
          value={selectedArea}
          onChange={handleSelectArea}>

            {/* Dropdown button */}
            <Listbox.Button className="w-full cursor-pointer text-xl sm:text-2xl xl:text-[22px] text-black py-3 focus:outline-none opacity-[60%] font-['Jersey_10']">
              {selectedArea || 'Any'}
            </Listbox.Button>

            {/* Dropdown options */}
            <Listbox.Options>
              {areas.map((area, index) => (
                <Listbox.Option
                key={index}
                value={area}
                className={({active}) =>
                  `cursor-pointer select-none p-2 ${active ? 'bg-[#EF6F34] text-black' : ''}`}
                >
                  {area}
                </Listbox.Option>
              ))}
            </Listbox.Options>
            
          </Listbox>

          <p className="text-xl sm:text-2xl xl:text-[25px] text-black pt-5 font-['Jersey_10']">Choose an Ingredient: </p>

          {/* Search bar for ingredients */}
          <input
              type="text"
              value={search_ing}
              onChange={(e) => setSearch_Ing(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnterIng(e);
                }
              }}
              className="relative bg-[#E65340] text-black text-base sm:text-lg md:text-xl lg:text-[20px] w-[80%] rounded-[25px] border-[4px] border-[#C13737] mt-3 mb-7 p-3 font-['Jersey_10']"
              placeholder="Chicken"
            />

          {/* Current Ingredients */}
          <div className="flex flex-wrap gap-3 p-5 justify-center">
              {filteredIngredients.map((ing, idx) => (
              <button key={idx} className="bg-[#f05d4a] text-xl px-3 py-1 rounded-full cursor-pointer font-['Jersey_10']" onClick={() => removeIngredient(ing)}>
                  {ing}
              </button>
              ))}
          </div>

        </div>

        {/* Meal Cards */}
        <div className="w-[82%] flex py-15 mx-auto">
          <div className="flex flex-wrap gap-7 justify-center min-w-0">
              {loading ? (
                <p className="text-white text-2xl font-bold">Loading...</p>
              ) : meals.length > 0 ? (
                meals.map((meal) => {
                  const isSaved = savedMeals.includes(meal.idMeal);
                  return (
                        <div
                        key={meal.idMeal}
                        onClick={() => handleRedirect(meal.idMeal)}
                        className="cursor-pointer relative h-60 aspect-[4/3] w-[280px] rounded-[20px] bg-[#E76A30] shadow-[0_12px_24px_rgba(0,0,0,0.4)] text-center group"
                        >
                  {/* Favorite Button */}
                  {isLoggedIn && ( // Only show when user is logged in
                  <button
                      onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering onClick of the card
                          toggleSavedMeal(meal);  // Send meal to backend to be favorited/unfavorited
                      }}
                      className="cursor-pointer absolute top-2 right-2 transform -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200"
                  >
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-6 h-6 text-yellow-400 ${isSaved ? 'fill-current' : 'fill-none'} stroke-current stroke-2`}
                      >
                      
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                  </button>
                  )}

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
       </div>
       
     </div>

        {/* sidebar */}
        <Sidebar isOpen={openSidebar} isClose={closeSidebar} isLoggedIn={isLoggedIn}/>

    </div>
  );

}

export default Home;
