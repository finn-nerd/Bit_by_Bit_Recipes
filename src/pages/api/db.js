import { Pool } from 'pg';

// Pool to be reused across all API routes
let pool;
if (!global._savedRecipesPool) {
  global._savedRecipesPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20, // Maximum connections allowed on Heroku
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000 // Return error after 2 seconds if connection not established
  });
  
  // Error handler
  global._savedRecipesPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
  // Handle application shutdown
  process.on('SIGINT', () => {
    if (global._savedRecipesPool) {
      console.log('Closing database pool connections');
      global._savedRecipesPool.end();
    }
    process.exit();
  });
}

// Export the pool to be used by other files
const db = global._savedRecipesPool;
export default db;