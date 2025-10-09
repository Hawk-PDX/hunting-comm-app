const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hunting_comm',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
};

const pool = new Pool(dbConfig);

// Test the database connection
pool.on('connect', () => {
  console.log('📊 Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL database connection error:', err);
  process.exit(-1);
});

// Function to execute queries
const query = (text, params) => pool.query(text, params);

// Function to get a client from the pool for transactions
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient
};