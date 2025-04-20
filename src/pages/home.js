import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/sidebar'
import { Listbox } from '@headlessui/react';

function Home() {
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

  // side bar
  const [openSidebar, setOpenSidebar] = useState(false); // sidebar isnt open by default

  // Create list of favorited meals
  const [savedMeals, setSavedMeals] = useState([]); // or useState(new Set())


  useEffect(() => {
    fetchMeals(); // default category
    fetchSavedMeals();
    fetchCats();
    fetchAreas();
  }, []);

  // Favorite a meal
  const toggleSavedMeal = (mealID) => {
      const isNowSaved = !savedMeals.includes(mealID)
      setSavedMeals((prev) =>
          isNowSaved ? [...prev, mealID] : prev.filter((id) => id !== mealID)
      );

      console.log(`SAVED ${mealID}: ${isNowSaved}`);
      // TODO:
      // update backend copy of favorites list
      // if (isNowFav) --> add it to db
      // else --> delete it from db
  };
  // Find currently favorited meals
  const fetchSavedMeals = async () => {
      // TODO:
      // find all favorite meal ids
      // populate the 'favorites' list with it

      // dummy data for now
      setSavedMeals(['52772', '52874', '52913']);
  };

  // Fetch meal data from backend
  const fetchMeals = async (query = 'chicken', type='search') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals?recipe=${encodeURIComponent(query)}&type=${type}`);

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

  // Fetch categories for dropdown menu
  const fetchCats = async (query) => {
    try {
      const res = await fetch(`/api/categories`);
      const data = await res.json();

      const categoryNames = data.meals.map((cat) => cat.strCategory);
      setCategories(categoryNames);
    } catch (err) {
      console.error("Failed to categories:", err);
      setCategories([]);
    }
  };
  // for category selection from filter bar
  const handleSelectCat = (value) => {
    setSelectedCat(value)
    fetchMeals(value, 'category');
  }

  // Fetch categories for dropdown menu
  const fetchAreas = async (query) => {
    try {
      const res = await fetch(`/api/areas`);
      const data = await res.json();

      const areaNames = data.meals.map((area) => area.strArea);
      setAreas(areaNames);
    } catch (err) {
      console.error("Failed to areas:", err);
      setAreas([]);
    }
  };
  // for area selection from filter bar
  const handleSelectArea = (value) => {
    setSelectedArea(value)
    fetchMeals(value, 'area');
  }

  // search bar enter
  const handleEnter = async (e) => {
    e.preventDefault();
    fetchMeals(search_input, 'search');
  };

  // search bar enter for ingredients
  const handleEnterIng = async (e) => {
    e.preventDefault();
    fetchMeals(search_ing, 'ingredient');
  };

  // clicking on a meal card
  const handleRedirect = (recipeID) => {
    router.push(`/recipes/${recipeID}`);
  }

  // sidebar
  const toggleSidebar = () => setOpenSidebar(!openSidebar);
  const closeSidebar = () => setOpenSidebar(false);

  return (
    <div className="App">

      {/* Left filter bar */}
      <div className="fixed overflow-y-auto scrollbar-hide left-0 w-[15%] top-[10%] h-[90%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-1 flex flex-col items-center">
        <p className="text-xl sm:text-2xl xl:text-[25px] text-black pt-10 font-['Jersey_10']">Choose a Category: </p>

        {/* Dropdown menu for categories */}
        <Listbox
        as='div'
        value={selectedCat}
        onChange={handleSelectCat}>

          {/* Dropdown button */}
          <Listbox.Button className="w-full cursor-pointer text-xl sm:text-2xl xl:text-[22px] text-black py-3 focus:outline-none opacity-[60%] font-['Jersey_10']">
            {selectedCat || 'Select an option:'}
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
            {selectedArea || 'Select an option:'}
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
            placeholder="Search for an ingredient..."
          />

      </div>

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
      <div className="flex flex-wrap justify-center mt-[180px] pb-10 pl-[16%] gap-7">

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
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onClick of the card
                        toggleSavedMeal(meal.idMeal);  // Send meal to backend to be favorited/unfavorited
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
