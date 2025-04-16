// src/pages/api/meals.js

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  const { recipe } = req.query;
  
  let list = [];

  if (recipe) {
    list = [
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${recipe}`, // search for a specific category
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${recipe}`, // saerch for a specific area
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${recipe}` // search for a specific ingredient(s)
    ];
  } else {
    list = [`https://www.themealdb.com/api/json/v1/1/search.php?s=`];
  }

  let data = null;

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`);
    const result = await response.json();

    if (result.meals && result.meals[0].strMeal.toLowerCase() === recipe.toLowerCase()) {
      data = result;
    } else {
      for (const i of list) {
        const response = await fetch(i);
        const result = await response.json();
    
        // if find a valid result, break
        if (result && result.meals) {
          data = result;
          break;
        }
      }
    }

    if (!data || data.meals === null) {
      return res.status(404).json({ message: 'No meals found.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
  }
}
