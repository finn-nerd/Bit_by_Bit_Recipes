// src/pages/api/meals.js

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  const { category } = req.query;

  // Choose the correct endpoint based on the query
  const endpoint = category
    ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    : `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data || data.meals === null) {
      return res.status(404).json({ message: 'No meals found.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
  }
}
