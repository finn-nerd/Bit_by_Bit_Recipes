export default async function handler(req, res) {
    const { method } = req;
  
    if (method !== 'GET') {
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  
    const { category } = req.query;
  
    let data = null;
  
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`);
      const result = await response.json();
  
      res.status(200).json(result);
    } catch (error) {
      console.error('API fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch from TheMealDB API' });
    }
  }
  