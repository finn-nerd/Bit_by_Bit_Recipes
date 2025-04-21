import db, { withClient } from "./db";
import getUserFromReq from "./auth";

export default async function handler(req, res) {
    const { method } = req;

    if (method !== "GET") {
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    let user;
    try {
        user = await getUserFromReq(req);
    } catch (err) {
        return res.status(err.status || 401).json({ message: err.message });
    }

    try {
        const result = await withClient(async (client) => {
            // fetch all recipe_ids they've saved
            const { rows } = await client.query(
                `SELECT sr.recipe_id, sr.recipe_name, sr.img_url, r.mealdb_id
                 FROM saved_recipes sr
                 JOIN recipes r ON sr.recipe_id = r.id
                 WHERE sr.user_id = $1`,
                [user.id],
            );

            const savedMeals = rows.map((r) => ({
                mealID: r.mealdb_id,
                recipeID: r.recipe_id, // Local ID
                mealName: r.recipe_name,
                mealThumbnail: r.img_url,
            }));

            return {
                status: 200,
                data: { savedMeals: savedMeals || [] },
            };
        });

        return res.status(result.status).json(result.data);
    } catch (err) {
        // auth error or DB error
        console.error("Error fetching saved meals:", err);
        return res.status(err.status || 500).json({ error: err.message });
    }
}
