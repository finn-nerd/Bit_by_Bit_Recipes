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
            
        </div>
    );

}

export default MyKitchen;
