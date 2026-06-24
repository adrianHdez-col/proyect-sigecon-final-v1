import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3307',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'sigecon',
} = process.env;

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await conn.query('SELECT 1');
    console.log('OK: DB reachable');
    const [rows] = await conn.query(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [DB_NAME]
    );
    if (rows.length) console.log(`Database '${DB_NAME}' exists`);
    else console.log(`Database '${DB_NAME}' NOT found`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB check failed:', err.message || err);
    process.exit(1);
  }
})();
