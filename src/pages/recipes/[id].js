import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

// Fetch meal that was sent to this page
export async function getServerSideProps(context) {
    const { id } = context.params;
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();

    const { token } = parseCookies(context);

    return {
        props: { meal: data.meals[0], isLoggedIn: Boolean(token) },
    };
}

function Recipe({ meal, isLoggedIn }) {
    const router = useRouter(); // used to navigate to diff pages
    const ingredients = [];
    const [isSaved, setIsSaved] = useState([]);

    // Check if this meal is saved
    useEffect(() => {
        fetchSavedMeal();
    }, [meal]);

    const fetchSavedMeal = async () => {
        if (isLoggedIn) {
            try {
                const res = await fetch("/api/fetch_saved_meals");
                if (!res.ok) throw new Error(await res.text());
                const { savedMeals } = await res.json();
                setIsSaved(savedMeals.map((m) => m.mealID).includes(meal.idMeal));
            } catch (err) {
                console.error("Could not load saved recipes:", err);
            }
        } else setIsSaved(false);
    };

    const toggleSavedMeal = () => {
        // Update local copy of saved IDs
        const newState = !isSaved; // setter is async
        setIsSaved(newState); // may not run before below call
        // Update DB
        updateSavedMeals(meal.idMeal, meal.strMeal, meal.strMealThumb, newState);
    };

    const updateSavedMeals = async (mealID, mealName, mealThumbnail, mealIsSaved) => {
        console.log(mealID);
        console.log(mealName);
        console.log(mealThumbnail);
        console.log(mealIsSaved);
        try {
            const res = await fetch("/api/update_saved_meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mealID, // ID of the meal
                    mealName, // Name of the meal
                    mealThumbnail, // Thumbnail image URL
                    mealIsSaved, // Boolean
                }),
            });

            // Handle non-OK response
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            const data = await res.json();
            console.log(data.message); // "Successfully saved meal {mealID}: {mealName}"
        } catch (err) {
            console.error("Error saving meal:", err);
        }
    };

    for (let i = 1; ; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measurement = meal[`strMeasure${i}`];

        if (ingredient) {
            ingredients.push(measurement + " " + ingredient);
        } else {
            break;
        }
    }

    const handleRandom = async () => {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const data = await response.json();
            router.push(`/recipes/${data.meals[0].idMeal}`);
        } catch (error) {
            console.error("Error fetching random meal:", error);
        }
    };

    const redirectHome = () => router.push("../home");
    const redirectKitchen = () => router.push(`/my_kitchen`);

    return (
        <>
            <Head>
                <title>{meal.strMeal} • Bit by Bit Recipes</title>
            </Head>
            <div className="App">
                {/* Top bar */}
                <div className="py-1 top-0 left-0 w-full bg-gradient-to-b from-[#F18D5E] to-[#EF6F34] z-10">
                    <div className="flex items-center my-5">
                        <button
                            className="cursor-pointer bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10'] z-20"
                            type="button"
                            onClick={redirectHome}
                        >
                            Back to Home
                        </button>

                        {/* Save recipe button */}
                        {isLoggedIn && (
                            <button
                                onClick={toggleSavedMeal}
                                className="flex flex-row items-center gap-5 cursor-pointer ml-auto bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10']"
                            >
                                Save Recipe
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-8 h-8 text-yellow-400 ${isSaved ? "fill-current" : "fill-none"} stroke-current stroke-2`}>
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </button>
                        )}

                        {/* My Kitchen page */}
                        <button
                            onClick={redirectKitchen}
                            className="cursor-pointer ml-auto bg-[#EB4B4B] text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] px-5 py-3 mx-10 rounded-[20px] border-[4px] border-[#B21F1F] font-['Jersey_10']"
                        >
                            My Kitchen
                        </button>
                    </div>
                </div>

                {/* Rest of page */}
                <div className="pt-5 px-10 relative">
                    {/* Random Recipe */}
                    <button className="absolute top-5 right-5 cursor-pointer p-2 hover:scale-105 transition-transform ml-auto btn-active no-shadow" onClick={handleRandom}>
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

                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Left side */}
                        <div className="w-full lg:w-1/3 flex flex-col justify-start items-center px-5">
                            {/* Image */}
                            <img className="w-full object-cover rounded-[12px] mb-5" src={meal.strMealThumb} alt={meal.strMeal} />

                            {/* Video */}
                            {meal.strYoutube && (
                                <iframe className="w-full aspect-video my-15 rounded-xl" src={meal.strYoutube.replace("watch?v=", "embed/")} title="Video Instructions" allowFullScreen />
                            )}
                        </div>

                        {/* Right side */}
                        <div className="w-full lg:w-2/3 text-justify">
                            {/* Title */}
                            <h1 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[50px] mt-5 font-['Jersey_10']">{meal.strMeal}</h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap jusitfy-center gap-5 mt-3">
                                {/* Category */}
                                <h2 className="bg-[#E96629] text-white p-3 rounded-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[20px] font-['Jersey_10']">
                                    Category: {meal.strCategory}
                                </h2>

                                {/* Area */}
                                <h2 className="bg-[#E75830] text-white p-3 rounded-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[20px] font-['Jersey_10']">
                                    Area: {meal.strArea}
                                </h2>
                            </div>

                            {/* Tags */}
                            {meal.strTags && ( // checks whether tags exist for this recipe to display it
                                <div className="flex flex-wrap jusitfy-center gap-5">
                                    {meal.strTags.split(",").map((tag) => (
                                        <span key={tag} className="bg-[#E25046] text-white p-2 rounded-full text-xl sm:text-2xl xl:text-[18px] mt-5 font-['Jersey_10']">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Ingredient title */}
                            <h2 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] py-5 font-['Jersey_10']">Ingredients</h2>

                            {/* Actual ingredients */}
                            <div className="flex flex-wrap jusitfy-center gap-5 mb-5">
                                {ingredients.map((tag) => (
                                    <span key={tag} className="bg-[#E25046] text-white p-3 rounded-full text-xl sm:text-2xl xl:text-[18px] font-['Jersey_10']">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Intructions title */}
                            <h2 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] py-5 font-['Jersey_10']">Instructions</h2>

                            {/* Actual instructions */}
                            <div className="text-xl sm:text-2xl xl:text-[22px] mb-7 font-['Jersey_10']">
                                {meal.strInstructions.split("\n").map((line, index) => (
                                    <p className="mb-3" key={index}>
                                        {line}
                                        <br />
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Recipe;
