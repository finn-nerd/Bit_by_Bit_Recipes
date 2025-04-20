import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { parse, serialize} from 'cookie';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Extract and verify JWT from cookie or Authorization header
export default async function getUserFromReq(req) {
  let token = null;
  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  } else if (req.headers.cookie) {
    // Check cookie
    const cookies = parse(req.headers.cookie);
    token = cookies.token;
  }

  if (!token) {
    const err = new Error('Not authenticated');
    err.status = 401;
    throw err;
  }

  // Verify token
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 401;
    throw err;
  }

  // Fetch user record
  const { rows } = await pool.query(
    'SELECT id, username FROM users WHERE id = $1',
    [payload.userId]
  );
  if (!rows.length) {
    const err = new Error('User not found');
    err.status = 401;
    throw err;
  }

  return { id: rows[0].id, username: rows[0].username };
}