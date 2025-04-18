import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Fetch meal that was sent to this page
export async function getServerSideProps(context) {
    const { id } = context.params;
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
  
    return {
        props: { meal: data.meals[0], },
    };
}

function Recipe({ meal }) {
    const router = useRouter(); // used to navigate to diff pages
    const ingredients = [];

    for(let i = 1; ; i++){
        const ingredient = meal[`strIngredient${i}`];
        const measurement = meal[`strMeasure${i}`];

        if(ingredient){
            ingredients.push(`${measurement} of ${ingredient}`);
        } else {
            break;
        }
    }

    const handleClick = () => router.push('../home');

    return (
        <div className="App">

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

            {/* Rest of page */}
            <div className="pt-[150px] px-10">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* Left side */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-start items-center px-5">

                        {/* Image */}
                        <img className="w-full object-cover rounded-[12px]"
                        src={meal.strMealThumb} alt={meal.strMeal} />

                        {/* Title */}
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[50px] mt-5 font-['Jersey_10']">{meal.strMeal}</h1>

                        <div className="flex flex-wrap jusitfy-center gap-5 mt-3">
                            {/* Category */}
                            <h2 className="bg-[#E96629] text-white p-5 rounded-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[30px] font-['Jersey_10']">Category: {meal.strCategory}</h2>

                            {/* Area */}
                            <h2 className="bg-[#E75830] text-white p-5 rounded-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[30px] font-['Jersey_10']">Area: {meal.strArea}</h2>
                        </div>


                        {/* Tags */}
                        {meal.strTags && ( // checks whether tags exist for this recipe to display it
                            <div className="flex flex-wrap jusitfy-center gap-5">
                                {meal.strTags.split(',').map(tag => (
                                    <span
                                    key={tag}
                                    className="bg-[#E25046] text-white p-3 rounded-full text-xl sm:text-2xl xl:text-[25px] mt-5 font-['Jersey_10']">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Right side */}
                    <div className="w-full lg:w-2/3 text-justify">

                        {/* Ingredient title */}
                        <h2 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] py-5 font-['Jersey_10']">Ingredients</h2>
                        
                        {/* Actual ingredients */}
                        <div className="flex flex-wrap jusitfy-center gap-5 mb-5">
                            {ingredients.map(tag => (
                                <span
                                key={tag}
                                className="bg-[#E25046] text-white p-3 rounded-full text-xl sm:text-2xl xl:text-[18px] font-['Jersey_10']">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Intructions title */}
                        <h2 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] py-5 font-['Jersey_10']">Instructions</h2>

                        {/* Actual instructions */}
                        <div className="text-xl sm:text-2xl xl:text-[22px] mb-7 font-['Jersey_10']">
                            {meal.strInstructions.split('\n').map((line, index) => (
                                <p 
                                className="mb-3"
                                key={index}>
                                    {line}
                                    <br />
                                </p>
                            ))}
                        </div>

                        {/* Video Instructions */}
                        <a className="block text-[#3971E8] text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] mb-10 font-['Jersey_10'] hover:underline"
                        href={meal.strYoutube}>Video Instructions</a>
                 
                    </div>

                </div>
            </div>
        </div>
    );


}

export default Recipe;