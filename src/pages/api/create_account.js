import db from './db'
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  // Trimming to avoid blank username and passwords
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  
  try {
    // Check if the username already exists
    const userCheck = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}