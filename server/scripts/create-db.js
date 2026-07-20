import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbName = process.env.DB_NAME || 'cv3_homeshopping_db';

try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();

  console.log(`[create-db] database ready: ${dbName}`);
} catch (error) {
  console.error('[create-db] failed to create database');
  console.error('Check MySQL service, server/.env values, and root password.');
  console.error(error.message);
  process.exit(1);
}
