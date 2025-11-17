/**
 * Database Initialization Script
 * 
 * This script initializes the database schema for the Hunting Communication App.
 * 
 * Usage:
 *   node init-db.js
 * 
 * Make sure DATABASE_URL or database connection environment variables are set.
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/database');

const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');
  
  try {
    // Read the schema file
    console.log('📖 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    console.log('⚙️  Executing schema...');
    await pool.query(schema);
    
    console.log('✅ Database schema initialized successfully!\n');
    
    // Test query to verify
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    console.log('\n✨ Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase();
