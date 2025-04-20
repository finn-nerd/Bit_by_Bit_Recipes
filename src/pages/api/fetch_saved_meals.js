export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    // get saved recipes from database
    let saved_list = ['52772', '52874', '52959']

    try {
        let return_list = [] // used to return list of recipes

        // TODO -- REMOVE THIS
        // Replace it with frontend rendering base on meal id, thumbnail, and title (all pulled from DB)
        for (const i of saved_list) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${i}`); // obtain recipes based on id
            const result = await response.json();
            
            return_list.push(result.meals[0]);
            
        }

        res.status(200).json({meals: return_list}); // return saved recipes

    } catch (error) {
        console.error('API fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
    }
}