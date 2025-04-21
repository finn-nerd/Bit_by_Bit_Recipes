export default async function handler(req, res) {
    const { method } = req;

    if (method !== "POST") {
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    const { query, selectedCat, selectedArea, filteredIngredients } = req.body;

    let data = null;

    try {
        // No query results, fetch random meals
        if (!query && !selectedCat && !selectedArea && (!filteredIngredients || filteredIngredients.length === 0)) {
            // Replace this with random recipe pull
            const defaultResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
            const defaultResult = await defaultResponse.json();
            // Shuffle results and take first 40
            data = defaultResult.meals.sort(() => Math.random() - 0.5).slice(0, 40);
            return res.status(200).json(data);
        }

        // Apply query
        if (query) {
            const searchResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const searchResult = await searchResponse.json();
            if (searchResult.meals) data = searchResult.meals;
        }
        // Apply category filter
        if (selectedCat) {
            const catResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCat}`);
            const catResult = await catResponse.json();
            if (catResult.meals) {
                if (!data)
                    // no data yet, initialize
                    data = catResult.meals; // filter current data
                else data = data.filter((meal) => catResult.meals.some((catMeal) => catMeal.idMeal === meal.idMeal));
            }
        }
        // Apply area filter
        if (selectedArea) {
            const areaResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`);
            const areaResult = await areaResponse.json();
            if (areaResult.meals) {
                if (!data)
                    // no data yet, initialize
                    data = areaResult.meals; // filter current data
                else data = data.filter((meal) => areaResult.meals.some((areaMeal) => areaMeal.idMeal === meal.idMeal));
            }
        }
        // Apply ingredient filter
        if (Array.isArray(filteredIngredients) && filteredIngredients.length > 0) {
            const csvIngredients = filteredIngredients
                .map((ingredient) => ingredient.trim()) // Trim each ingredient
                .join(","); // Join with commas
            const ingResponse = await fetch(`https://www.themealdb.com/api/json/v2/${process.env.API_KEY}/filter.php?i=${csvIngredients}`);
            const ingResult = await ingResponse.json();
            if (ingResult.meals) {
                if (!data)
                    // no data yet, initialize
                    data = ingResult.meals; // filter current data
                else data = data.filter((meal) => ingResult.meals.some((ingMeal) => ingMeal.idMeal === meal.idMeal));
            }
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No meals found." });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("API fetch error:", error);
        res.status(500).json({ error: "Failed to fetch from TheMealDB API" });
    }
}
