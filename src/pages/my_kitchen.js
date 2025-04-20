import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function MyKitchen() {
    const [userInputResponse, setUserInputResponse] = useState('');
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // used to navigate to diff pages

    // Fetch meal data from backend
    const fetchSavedMeals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/fetch_saved_meals`);

            // If category doesn't exist or the response is not OK
            if (!res.ok) {
                const error = await res.json();
                setUserInputResponse(error.message || 'No meals found.');
                setMeals([]);  // Clear meals list
                setLoading(false);
                return;
            }

            // Get the data from the response
            const data = await res.json();

            // Transform the fetched meals data to objects with all needed card info
            const savedMeals = data.savedMeals.map(meal => ({
                mealID: meal.mealID,                // Meal ID
                mealName: meal.mealName,            // Meal name
                mealThumbnail: meal.mealThumbnail,  // Thumbnail image URL
            }));

            // Set the state with the transformed meal objects
            setMeals(savedMeals || []);
        } catch (err) {
            console.error("Failed to fetch meals:", err);
            setMeals([]);  // Clear meals list in case of error
        }

        setLoading(false);
    };

    // Unsave Meals
    const unsaveMeal = (meal) => {
        // Update local copy
        setMeals((prev) => prev.filter((id) => id !== meal.idMeal));
        // Update DB
        updateSavedMeals(meal.idMeal, meal.strMeal, meal.strMealThumb, false);
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

    useEffect(() => {
        fetchSavedMeals(); // default category
    }, []);

    const handleRedirect = (recipeID) => {
        router.push(`/recipes/${recipeID}`);
    }

    const handleClick = () => router.push('./home');

    return (
        <div className="App">

            {/* Left filter bar */}
            <div className="fixed left-0 w-[10%] h-[100%] bg-gradient-to-b from-[#EEAE36] to-[#E97832] z-1"></div>

            {/* Top bar */}
            <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-10">
                <div className="flex items-center my-5">
                    <button 
                    className="bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10'] z-20"
                    type="button" 
                    onClick={handleClick}>
                        Back to Home
                    </button>

                    {/* My Kitchen page */}
                    <h1 className="ml-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] mx-8 text-white font-['Jersey_10']">My Kitchen</h1>
                </div>
            </div>

        {/* Meal Cards */}
        {/* Meal Cards */}
      <div className="flex flex-wrap justify-center mt-[180px] px-10 pb-10 pl-[12%] gap-10">
        {loading ? (
        <p className="text-white text-2xl font-bold">Loading...</p>
        ) : meals.length > 0 ? (
        meals.map((meal) => {
            const isSaved = true;
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
                        unsaveMeal(meal);  // Send meal to backend to be favorited/unfavorited
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
            
        </div>
    );

}

export default MyKitchen;
