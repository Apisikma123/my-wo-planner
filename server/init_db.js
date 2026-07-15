import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log('Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'hgh_boost_db'}`);
    
    await connection.query(`USE ${process.env.DB_NAME || 'hgh_boost_db'}`);

    console.log('Creating height_history table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS height_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(20) NOT NULL UNIQUE,
        height_cm DECIMAL(5,1) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating sleep_logs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sleep_logs (
        date VARCHAR(20) PRIMARY KEY,
        bedtime VARCHAR(10) NOT NULL,
        duration DECIMAL(4,1) NOT NULL,
        dark_room BOOLEAN NOT NULL,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating nutrition_logs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS nutrition_logs (
        date VARCHAR(20) PRIMARY KEY,
        calcium_mg INT NOT NULL,
        protein_g INT NOT NULL,
        water_l DECIMAL(4,1) NOT NULL,
        sugar_before_bed BOOLEAN NOT NULL,
        foods JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating supplement_logs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS supplement_logs (
        date VARCHAR(20) PRIMARY KEY,
        d3k2_taken BOOLEAN NOT NULL,
        d3k2_with_fat BOOLEAN NOT NULL,
        zinc_b2_taken BOOLEAN NOT NULL,
        zinc_b2_empty_stomach BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating plyo_logs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS plyo_logs (
        date VARCHAR(20) PRIMARY KEY,
        hang_minutes INT NOT NULL,
        plyo_minutes INT NOT NULL,
        core_minutes INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating workout_roster table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS workout_roster (
        iso_date VARCHAR(20) PRIMARY KEY,
        phase VARCHAR(20) NOT NULL,
        workout_type VARCHAR(20) NOT NULL,
        exercises JSON,
        hgh_score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialization successful!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initDB();
