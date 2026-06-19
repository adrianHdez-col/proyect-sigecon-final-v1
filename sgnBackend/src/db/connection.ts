import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'sigecon',
} = process.env;

export const db = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  const conn = await db.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
};
