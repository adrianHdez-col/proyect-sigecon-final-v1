import { db } from './connection.js';
const tableExists = async (tableName) => {
    const [rows] = await db.query(`SELECT TABLE_NAME
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`, [tableName]);
    return Array.isArray(rows) && rows.length > 0;
};
const columnExists = async (tableName, columnName) => {
    const [rows] = await db.query(`SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`, [tableName, columnName]);
    return Array.isArray(rows) && rows.length > 0;
};
const indexExists = async (tableName, indexName) => {
    const [rows] = await db.query(`SELECT INDEX_NAME
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`, [tableName, indexName]);
    return Array.isArray(rows) && rows.length > 0;
};
const addColumnIfMissing = async (tableName, columnName, definition) => {
    if (!(await columnExists(tableName, columnName))) {
        await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
};
const addIndexIfMissing = async (tableName, indexName, definition) => {
    if (!(await indexExists(tableName, indexName))) {
        await db.query(`ALTER TABLE ${tableName} ADD ${definition}`);
    }
};
export const ensureSchema = async () => {
    await db.query(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      nit VARCHAR(50) UNIQUE,
      direccion VARCHAR(255),
      telefono VARCHAR(30),
      email_contacto VARCHAR(120),
      sitio_web VARCHAR(180),
      subdominio VARCHAR(120) NOT NULL UNIQUE,
      descripcion TEXT,
      industria VARCHAR(120),
      tamano VARCHAR(80),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
    if (await tableExists('usuarios')) {
        await addColumnIfMissing('usuarios', 'empresa_id', 'INT NULL');
        await addColumnIfMissing('usuarios', 'cargo_objetivo', 'VARCHAR(140) NULL');
        await addColumnIfMissing('usuarios', 'ubicacion', 'VARCHAR(140) NULL');
        await addColumnIfMissing('usuarios', 'linkedin', 'VARCHAR(180) NULL');
        await addColumnIfMissing('usuarios', 'sitio_web', 'VARCHAR(180) NULL');
        await addIndexIfMissing('usuarios', 'idx_usuarios_empresa', 'INDEX idx_usuarios_empresa (empresa_id)');
    }
    await db.query(`
    CREATE TABLE IF NOT EXISTS vacantes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      empresa_id INT NOT NULL,
      titulo VARCHAR(160) NOT NULL,
      area VARCHAR(120),
      descripcion TEXT,
      requisitos TEXT,
      salario DECIMAL(12,2),
      tipo_contrato VARCHAR(80),
      modalidad VARCHAR(80),
      ubicacion VARCHAR(140),
      experiencia VARCHAR(80),
      fecha_limite DATE,
      estado VARCHAR(40) DEFAULT 'abierta',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_vacantes_empresa (empresa_id),
      INDEX idx_vacantes_estado (estado)
    )
  `);
    await addColumnIfMissing('vacantes', 'ubicacion', 'VARCHAR(140) NULL');
    await addColumnIfMissing('vacantes', 'experiencia', 'VARCHAR(80) NULL');
    await db.query(`
    CREATE TABLE IF NOT EXISTS postulaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vacante_id INT NOT NULL,
      candidato_id INT NOT NULL,
      fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      estado VARCHAR(60) DEFAULT 'postulado',
      comentarios TEXT,
      score INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_postulacion (vacante_id, candidato_id),
      INDEX idx_postulaciones_candidato (candidato_id),
      INDEX idx_postulaciones_vacante (vacante_id),
      INDEX idx_postulaciones_estado (estado)
    )
  `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS candidato_perfiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL UNIQUE,
      titulo VARCHAR(160),
      ubicacion VARCHAR(140),
      telefono VARCHAR(30),
      linkedin VARCHAR(180),
      sitio_web VARCHAR(180),
      idiomas TEXT,
      resumen_profesional TEXT,
      experiencia JSON,
      educacion JSON,
      habilidades JSON,
      certificaciones JSON,
      completitud INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_perfiles_usuario (usuario_id)
    )
  `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS candidato_guardados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      vacante_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_guardado (usuario_id, vacante_id),
      INDEX idx_guardados_usuario (usuario_id),
      INDEX idx_guardados_vacante (vacante_id)
    )
  `);
};
