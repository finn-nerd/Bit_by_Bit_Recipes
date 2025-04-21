import db, { withClient } from './db'
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  // Trimming to avoid blank username and passwords
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();
  const confirmPassword = req.body.confirmPassword?.trim();

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing username, password, or confirm password.' });
  }
  
  try {
    const result = await withClient(async (client) => {
      // Check if the username already exists
      const userCheck = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      if (userCheck.rows.length > 0) {
        return { status: 409, data: { message: 'Username taken!' } };
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (password != confirmPassword) {
        return { status: 400, data: { message: 'Password and confirm password are not the same.' } };
      }
      
      // Insert the new user into the database
      const insertResult = await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
      );
      
      return {
        status: 201,
        data: { user: insertResult.rows[0] }
      };
    });
    
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}