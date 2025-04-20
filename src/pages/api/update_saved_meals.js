export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
  // Set variables for the information fields
  const mealID = req.body.mealID
  const mealName = req.body.mealName
  const mealThumbnail = req.body.mealThumbnail
  const isSaved = req.body.mealIsSaved

    if (!mealID || !mealName || !mealThumbnail || !isSaved) {
        return res.status(400).json({ message: 'Missing meal information' });
    }
  
    try {
        // DB LOGIC HERE
        if (isSaved) {
            // DB INSERT
        }
        else {
            // DB DELETE
        }

        res.status(200).json({ message: `Successfully saved meal ${mealID}: ${mealName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}