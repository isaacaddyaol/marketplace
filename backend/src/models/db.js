// backend/src/models/db.js
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Ensure .env is loaded correctly relative to this file

if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env file");
  // In a real app, you might want to exit here or throw a more specific error
  // For the subtask environment, we'll proceed but log the error.
  // throw new Error("FATAL ERROR: DATABASE_URL is not defined.");
}

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // Example for SSL in production
};

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Successfully connected to the PostgreSQL database via pg Pool.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client in pg Pool', err);
  // process.exit(-1); // In a real app, you might want to exit on critical pool errors
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  // You can add a dedicated connect function if needed for explicit connection testing elsewhere
  // async connect() {
  //   try {
  //     const client = await pool.connect();
  //     console.log('Explicit connection test to PostgreSQL successful.');
  //     client.release();
  //   } catch (error) {
  //     console.error('Failed to connect to PostgreSQL:', error);
  //     throw error;
  //   }
  // }
  getPool: () => pool // Expose pool if needed for transactions etc.
};
