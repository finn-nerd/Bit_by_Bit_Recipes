// src/pages/api/meals.js

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  const { recipe, type } = req.query;
  
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
    switch(type) {
      case 'search':
        default:
          const searchResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`);
          const searchResult = await searchResponse.json();
      
          if (searchResult.meals && searchResult.meals[0].strMeal.toLowerCase() === recipe.toLowerCase()) {
            data = searchResult;
          } else {
            for (const i of list) {
              const newResponse = await fetch(i);
              const newResult = await newResponse.json();
          
              // if find a valid result, break
              if (newResult && newResult.meals) {
                data = newResult;
                break;
              }
            }
          }

          break;
      
      case 'category':
        const catResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${recipe}`);
        const catResult = await catResponse.json();

        data = catResult;

        break;

      case 'area':
        const areaResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${recipe}`);
        const areaResult = await areaResponse.json();

        data = areaResult;

        break;

      case 'ingredient':
        const ingResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${recipe}`);
        const ingResult = await ingResponse.json();

        data = ingResult;

        break;

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
