import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carga el .env del backend (sube un nivel desde scripts/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const usersToUpdate = [
  { email: 'superadmin@empresa.com', password: '12345678' },
  { email: 'rrhh@techcorp.com', password: '12345678' },
  { email: 'psicologo@techcorp.com', password: '12345678' },
  { email: 'rrhh@solucionesrh.com', password: '12345678' },
  { email: 'juan.perez@example.com', password: '12345678' },
  { email: 'maria.lopez@example.com', password: '12345678' }
];

async function generateAndUpdate() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sigecon'
    });

    console.log('✅ Conectado a MySQL\n');

    for (const user of usersToUpdate) {
      const hash = await bcrypt.hash(user.password, 10);
      
      const [result] = await connection.execute(
        'UPDATE usuarios SET password_hash = ? WHERE email = ?',
        [hash, user.email]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ Actualizado: ${user.email}`);
      } else {
        console.log(`⚠️  No encontrado: ${user.email}`);
      }
    }

    console.log('\n🎉 Proceso completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Solo imprime SQL (sin tocar BD)
async function printSQLOnly() {
  console.log('--- SQL para ejecutar manualmente ---\n');
  for (const user of usersToUpdate) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE email = '${user.email}';`);
  }
}

// Elige el modo:
 await generateAndUpdate();   // ← Actualiza en BD
//await printSQLOnly();          // ← Solo imprime SQL