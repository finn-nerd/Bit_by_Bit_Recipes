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

    // Fetch list of saved recipes from database
    let savedMeals = [];
    try {
        // authenticate the user and get their ID
        const user = await getUserFromReq(req);
        // fetch all recipe_ids they’ve saved
        const { rows } = await pool.query(
            `SELECT recipe_id, recipe_name, img_url
                FROM saved_recipes
            WHERE user_id = $1`,
            [user.id]
        );
        savedMeals = rows.map(r => ({
            mealID: r.recipe_id,
            mealName: r.recipe_name,
            mealThumbnail: r.img_url
        }));
    } catch (err) {
        // auth error or DB error
        return res.status(err.status || 401).json({ error: err.message });
    }

    try {
        
        res.status(200).json({ savedMeals: savedMeals || [] });

    } catch (error) {
        console.error('API fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
    }
}