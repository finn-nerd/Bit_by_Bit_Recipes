import db from './db'
import getUserFromReq from './auth';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    // Fetch list of saved recipes from database
    let savedMeals = [];
    try {
        // authenticate the user and get their ID
        const user = await getUserFromReq(req);
        // fetch all recipe_ids they’ve saved
        const { rows } = await db.query(
          `SELECT sr.recipe_id, sr.recipe_name, sr.img_url, r.mealdb_id
           FROM saved_recipes sr
           JOIN recipes r ON sr.recipe_id = r.id
           WHERE sr.user_id = $1`,
          [user.id]
        );
        savedMeals = rows.map(r => ({
          mealID: r.mealdb_id, 
          recipeID: r.recipe_id, // Local ID
          mealName: r.recipe_name,
          mealThumbnail: r.img_url
        }));
        res.status(200).json({ savedMeals: savedMeals || [] });
    } catch (err) {
        // auth error or DB error
        return res.status(err.status || 401).json({ error: err.message });
    }
let user;
  try {
    user = await getUserFromReq(req);
  } catch (err) {
    return res.status(err.status || 401).json({ message: err.message });
  }
}