import db from './db'
import getUserFromReq from './auth'; 

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

let user;
  try {
    user = await getUserFromReq(req);
  } catch (err) {
    return res.status(err.status || 401).json({ message: err.message });
  }

  
  // Set variables for the information fields
  const mealID = req.body.mealID
  const mealName = req.body.mealName
  const mealThumbnail = req.body.mealThumbnail
  const isSaved = req.body.mealIsSaved

  if (
    !mealID ||
    typeof isSaved !== 'boolean' ||
    (isSaved && (!mealName || !mealThumbnail))
  ) {
    return res.status(400).json({ message: 'Missing or invalid meal information' });
  }

    try {
        if (isSaved) {
          // Upsert into recipes table
          const upsert = await db.query(
            `INSERT INTO recipes (mealdb_id, name, thumbnail)
             VALUES ($1, $2, $3)
             ON CONFLICT (mealdb_id)
               DO UPDATE SET
                 name      = EXCLUDED.name,
                 thumbnail = EXCLUDED.thumbnail
             RETURNING id`,
            [mealID, mealName, mealThumbnail]
          );
          const localRecipeId = upsert.rows[0].id;
    
          // Insert into saved_recipes using that local ID
          await db.query(
            `INSERT INTO saved_recipes (user_id, recipe_id, recipe_name, img_url)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, recipe_id) DO NOTHING`,
             [user.id, localRecipeId, mealName, mealThumbnail]
          );
    
          return res.status(200).json({ message: `Successfully saved meal ${mealID}: ${mealName}` });
    
        } else {
            // Unsave
          const got = await db.query(
            `SELECT id FROM recipes WHERE mealdb_id = $1`,
            [mealID]
          );
          if (got.rows.length) {
            const localRecipeId = got.rows[0].id;
            await db.query(
              `DELETE FROM saved_recipes
                WHERE user_id   = $1
                  AND recipe_id = $2`,
              [user.id, localRecipeId]
            );
          }
          return res.status(200).json({ message: `Successfully unsaved meal ${mealID}` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}