import { Pool } from 'pg';
import getUserFromReq from './auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    // get saved recipes from database
  let saved_list;
  try {
    // authenticate the user and get their ID
    const user = await getUserFromReq(req);
    // fetch all recipe_ids they’ve saved
    const { rows } = await pool.query(
      `SELECT recipe_id
         FROM saved_recipes
        WHERE user_id = $1`,
      [user.id]
    );
    saved_list = rows.map(r => r.recipe_id);
  } catch (err) {
    // auth error or DB error
    return res.status(err.status || 401).json({ error: err.message });
  }

    try {
        let return_list = [] // used to return list of recipes

        for (const i of saved_list) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${i}`); // obtain recipes based on id
            const result = await response.json();

            if (result.meals && result.meals[0]) {
              return_list.push(result.meals[0]);
            }
            
        }
  
      res.status(200).json({meals: return_list}); // return saved recipes

    } catch (error) {
      console.error('API fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
    }
}