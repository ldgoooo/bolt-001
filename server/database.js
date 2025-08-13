import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and tables
export const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    let dbconfig={
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    }
    console.log("Database initialized start:",dbconfig)
    const connection = await mysql.createConnection(dbconfig);

    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Create bills table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS bills (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category ENUM('water', 'electricity', 'household', 'credit-card', 'phone', 'internet') NOT NULL,
        monthly_amount DECIMAL(10, 2) NOT NULL,
        due_date INT NOT NULL,
        payment_method ENUM('bank-transfer', 'credit-card', 'debit-card', 'cash', 'auto-pay') NOT NULL,
        is_paid BOOLEAN DEFAULT FALSE,
        last_paid_date DATETIME NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export default pool;