import React, { useState, useEffect } from 'react';

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

    return (
        <div className="App">
            {/*
                --- Placeholder Data ---
                See the API to find all values of meal json to see what can be displayed
                Should display at least:
                - Title
                - Picture
                - Ingredients
                - Steps
                - Categories (as tags below title, possibly)
                - Any other important info as you deem fit when u set up frontend

                https://www.themealdb.com/api.php
            */}
            <h1>{meal.strMeal}</h1>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <p>{meal.strInstructions}</p>
        </div>
    );


}

export default Recipe;