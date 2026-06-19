
 CREATE DATABASE IF NOT EXISTS sigecon;
 USE sigecon;

-- ======================================================
-- TABLAS PRINCIPALES
-- ======================================================

-- 1. Roles del sistema
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'SU, RRHH, Evaluador, Candidato',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Usuarios (autenticación y datos básicos)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt',
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. Permisos (para control granular, opcional pero sugerido)
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE COMMENT 'ej: crear_vacante, ver_reportes',
    descripcion TEXT
);

-- 4. Relación roles-permisos (muchos a muchos)
CREATE TABLE rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

-- 5. Recuperación de contraseña (tokens)
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token)
);

-- 6. Hojas de vida digital (datos complementarios del candidato)
CREATE TABLE hojas_vida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    perfil_profesional TEXT COMMENT 'resumen de habilidades y objetivos',
    habilidades TEXT COMMENT 'lista de habilidades separadas por coma',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 7. Experiencia laboral
CREATE TABLE experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoja_vida_id INT NOT NULL,
    empresa VARCHAR(150) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    descripcion TEXT,
    actual BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (hoja_vida_id) REFERENCES hojas_vida(id) ON DELETE CASCADE
);

-- 8. Estudios académicos
CREATE TABLE estudios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoja_vida_id INT NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion TEXT,
    FOREIGN KEY (hoja_vida_id) REFERENCES hojas_vida(id) ON DELETE CASCADE
);

-- 9. Vacantes
CREATE TABLE vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creador_id INT NOT NULL COMMENT 'Administrador RRHH que la crea',
    titulo VARCHAR(150) NOT NULL,
    area VARCHAR(100),
    salario DECIMAL(12,2),
    tipo_contrato ENUM('Tiempo completo', 'Medio tiempo', 'Freelance', 'Por horas') NOT NULL,
    modalidad ENUM('Presencial', 'Remoto', 'Híbrido') NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    fecha_limite DATE NOT NULL,
    estado ENUM('abierta', 'cerrada') DEFAULT 'abierta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_estado (estado),
    INDEX idx_fecha_limite (fecha_limite)
);

-- 10. Postulaciones (aplicación a vacantes)
CREATE TABLE postulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vacante_id INT NOT NULL,
    candidato_id INT NOT NULL,
    fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('postulado', 'preseleccionado', 'pruebas_asignadas', 'pruebas_aprobadas', 'rechazado', 'contratado') DEFAULT 'postulado',
    comentarios TEXT,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY uk_postulacion (vacante_id, candidato_id),
    INDEX idx_estado (estado)
);

-- 11. Pruebas (técnicas y psicotécnicas)
CREATE TABLE pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creador_id INT NOT NULL COMMENT 'Admin RRHH',
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('tecnica', 'psicotecnica') NOT NULL,
    duracion_minutos INT DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- 12. Banco de preguntas
CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prueba_id INT NOT NULL,
    texto TEXT NOT NULL,
    tipo ENUM('multiple', 'abierta', 'logica', 'personalidad') NOT NULL,
    opciones JSON COMMENT 'para preguntas múltiples: [{"opcion":"A","texto":"..."}]',
    peso DECIMAL(5,2) DEFAULT 1.00 COMMENT 'puntuación máxima',
    orden INT DEFAULT 0,
    FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE CASCADE,
    INDEX idx_prueba (prueba_id)
);

-- 13. Respuestas posibles (para preguntas cerradas)
CREATE TABLE respuestas_posibles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id INT NOT NULL,
    texto_respuesta TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    valor_puntaje DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);

-- 14. Resultados de pruebas por postulación (respuestas dadas por candidato)
CREATE TABLE resultados_pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id INT NOT NULL,
    prueba_id INT NOT NULL,
    fecha_realizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_total DECIMAL(10,2),
    respuestas_json JSON COMMENT 'Almacena respuestas del candidato {pregunta_id: respuesta_texto o id_opcion}',
    perfil_generado TEXT COMMENT 'Perfil psicológico si aplica',
    estado ENUM('pendiente', 'completado', 'calificado') DEFAULT 'pendiente',
    comentarios_evaluador TEXT,
    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE RESTRICT,
    INDEX idx_postulacion (postulacion_id)
);

-- 15. Inducciones (programa de bienvenida)
CREATE TABLE inducciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vacante_id INT NULL COMMENT 'Puede ser específica de una vacante o general',
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    contenido TEXT COMMENT 'URLs de videos, textos, etc.',
    fecha_inicio DATE,
    fecha_fin DATE,
    puntaje_minimo_aprobacion DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE SET NULL
);

-- 16. Progreso de inducción por candidato
CREATE TABLE induccion_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    induccion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'en_progreso', 'completado', 'reprobado') DEFAULT 'pendiente',
    fecha_completado DATETIME,
    puntaje_obtenido DECIMAL(5,2),
    certificado_ruta VARCHAR(255),
    FOREIGN KEY (induccion_id) REFERENCES inducciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY uk_induccion_usuario (induccion_id, usuario_id)
);

-- 17. Gestión documental (adjuntos varios)
CREATE TABLE documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    postulacion_id INT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_almacenamiento VARCHAR(500) NOT NULL,
    tipo_documento ENUM('hoja_vida_pdf', 'certificado', 'contrato', 'carta_presentacion', 'otros') NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id)
);

-- 18. Evaluaciones complementarias (notas de evaluadores sobre candidatos)
CREATE TABLE evaluaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id INT NOT NULL,
    evaluador_id INT NOT NULL COMMENT 'Usuario con rol Evaluador o RRHH',
    criterio VARCHAR(100) COMMENT 'prueba_tecnica, entrevista, etc.',
    nota DECIMAL(5,2),
    comentario TEXT,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_postulacion (postulacion_id)
);

-- ======================================================
-- DATOS DE PRUEBA
-- ======================================================

-- Insertar roles
INSERT INTO roles (nombre, descripcion) VALUES
('SU', 'Super Administrador - control total del sistema'),
('RRHH', 'Administrador de Recursos Humanos - gestión de vacantes y candidatos'),
('Evaluador', 'Psicólogo o evaluador técnico'),
('Candidato', 'Aspirante a vacantes');

-- Insertar permisos básicos (ejemplos)
INSERT INTO permisos (nombre, descripcion) VALUES
('crear_vacante', 'Permite crear nuevas vacantes'),
('editar_vacante', 'Permite modificar vacantes'),
('cerrar_vacante', 'Permite cerrar convocatorias'),
('ver_reportes', 'Acceso a reportes y métricas'),
('gestionar_usuarios', 'Crear, editar, deshabilitar usuarios'),
('asignar_pruebas', 'Asignar pruebas técnicas/psicotécnicas a candidatos'),
('evaluar_resultados', 'Calificar y emitir concepto de pruebas'),
('configurar_induccion', 'Configurar módulos de inducción');

-- Asignar permisos a roles (SU tiene todos, RRHH algunos, Evaluador específicos)
-- SU: todos los permisos (id 1-8)
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre='SU'), id FROM permisos;
-- RRHH: crear_vacante, editar_vacante, cerrar_vacante, ver_reportes, asignar_pruebas, configurar_induccion
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
((SELECT id FROM roles WHERE nombre='RRHH'), 1),
((SELECT id FROM roles WHERE nombre='RRHH'), 2),
((SELECT id FROM roles WHERE nombre='RRHH'), 3),
((SELECT id FROM roles WHERE nombre='RRHH'), 4),
((SELECT id FROM roles WHERE nombre='RRHH'), 6),
((SELECT id FROM roles WHERE nombre='RRHH'), 8);
-- Evaluador: ver_reportes, evaluar_resultados
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
((SELECT id FROM roles WHERE nombre='Evaluador'), 4),
((SELECT id FROM roles WHERE nombre='Evaluador'), 7);

-- Usuarios de prueba (contraseña: 12345678, encriptada con bcrypt)
-- Para efectos de prueba, se usa un hash genérico. Reemplazar con hash real.
INSERT INTO usuarios (rol_id, email, password_hash, nombre_completo, telefono, activo) VALUES
( (SELECT id FROM roles WHERE nombre='SU'), 'superadmin@empresa.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Super Administrador', '555-0001', TRUE),
( (SELECT id FROM roles WHERE nombre='RRHH'), 'rrhh@empresa.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Laura Gómez', '555-1234', TRUE),
( (SELECT id FROM roles WHERE nombre='Evaluador'), 'psicologo@empresa.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Carlos Méndez', '555-5678', TRUE),
( (SELECT id FROM roles WHERE nombre='Candidato'), 'juan.perez@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Juan Pérez', '555-8765', TRUE),
( (SELECT id FROM roles WHERE nombre='Candidato'), 'maria.lopez@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'María López', '555-4321', TRUE);

-- Hojas de vida para candidatos
INSERT INTO hojas_vida (usuario_id, fecha_nacimiento, direccion, perfil_profesional, habilidades) VALUES
( (SELECT id FROM usuarios WHERE email='juan.perez@example.com'), '1990-05-15', 'Calle 123, Bogotá', 'Ingeniero de sistemas con 5 años de experiencia', 'Python, Java, SQL, React'),
( (SELECT id FROM usuarios WHERE email='maria.lopez@example.com'), '1992-08-22', 'Carrera 45 #12-34, Medellín', 'Administradora de empresas, especialista en RRHH', 'Gestión de talento, reclutamiento, comunicación');

-- Experiencias laborales
INSERT INTO experiencias (hoja_vida_id, empresa, cargo, fecha_inicio, fecha_fin, descripcion, actual) VALUES
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='juan.perez@example.com')), 'Tech Solutions', 'Desarrollador Full Stack', '2019-01-01', '2023-12-31', 'Desarrollo de aplicaciones web', FALSE),
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='maria.lopez@example.com')), 'Grupo Empresarial', 'Asistente de RRHH', '2020-03-10', NULL, 'Apoyo en procesos de selección', TRUE);

-- Estudios
INSERT INTO estudios (hoja_vida_id, institucion, titulo, fecha_inicio, fecha_fin, descripcion) VALUES
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='juan.perez@example.com')), 'Universidad Nacional', 'Ingeniería de Sistemas', '2012-02-01', '2018-06-30', 'Pregrado'),
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='maria.lopez@example.com')), 'Universidad de Antioquia', 'Administración de Empresas', '2011-02-01', '2016-12-15', 'Pregrado');

-- Vacante de ejemplo
INSERT INTO vacantes (creador_id, titulo, area, salario, tipo_contrato, modalidad, descripcion, requisitos, fecha_limite, estado) VALUES
( (SELECT id FROM usuarios WHERE email='rrhh@empresa.com'), 'Desarrollador Full Stack', 'Tecnología', 4500000.00, 'Tiempo completo', 'Remoto', 'Desarrollo de aplicaciones web con React y Node.js', 'Experiencia comprobada en JavaScript, manejo de bases de datos, título profesional', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'abierta');

-- Postulación de Juan Pérez a la vacante
INSERT INTO postulaciones (vacante_id, candidato_id, estado) VALUES
( (SELECT id FROM vacantes WHERE titulo='Desarrollador Full Stack'), (SELECT id FROM usuarios WHERE email='juan.perez@example.com'), 'postulado');

-- Prueba técnica de ejemplo
INSERT INTO pruebas (creador_id, titulo, descripcion, tipo, duracion_minutos) VALUES
( (SELECT id FROM usuarios WHERE email='rrhh@empresa.com'), 'Prueba Técnica - JavaScript', 'Evaluación de conocimientos en JS y Node.js', 'tecnica', 60);

-- Preguntas de la prueba
INSERT INTO preguntas (prueba_id, texto, tipo, opciones, peso, orden) VALUES
( (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript'), '¿Cuál es la salida de console.log(typeof null)?', 'multiple', '[{"opcion":"A","texto":"null"},{"opcion":"B","texto":"object"},{"opcion":"C","texto":"undefined"},{"opcion":"D","texto":"number"}]', 2.0, 1),
( (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript'), 'Explica el concepto de closures en JavaScript', 'abierta', NULL, 3.0, 2);

-- Respuestas posibles para pregunta múltiple
INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'object', TRUE, 2.0 FROM preguntas p WHERE p.texto LIKE '%typeof null%' LIMIT 1;
INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'null', FALSE, 0 FROM preguntas p WHERE p.texto LIKE '%typeof null%' LIMIT 1;
INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'undefined', FALSE, 0 FROM preguntas p WHERE p.texto LIKE '%typeof null%' LIMIT 1;
INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'number', FALSE, 0 FROM preguntas p WHERE p.texto LIKE '%typeof null%' LIMIT 1;

-- Inducción de ejemplo
INSERT INTO inducciones (vacante_id, titulo, descripcion, contenido, fecha_inicio, fecha_fin, puntaje_minimo_aprobacion) VALUES
( (SELECT id FROM vacantes WHERE titulo='Desarrollador Full Stack'), 'Inducción para nuevos desarrolladores', 'Políticas internas, herramientas de trabajo y cultura empresarial', 'https://empresa.com/induccion/video1', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 70.00);

-- Documento de ejemplo (hoja de vida PDF)
INSERT INTO documentos (usuario_id, postulacion_id, nombre_archivo, ruta_almacenamiento, tipo_documento) VALUES
( (SELECT id FROM usuarios WHERE email='juan.perez@example.com'), (SELECT id FROM postulaciones LIMIT 1), 'Juan_Perez_CV.pdf', '/documentos/cvs/juan_perez.pdf', 'hoja_vida_pdf');

-- ======================================================
-- VISTA ÚTIL: Resumen de postulaciones con datos del candidato y vacante
-- ======================================================
CREATE VIEW vista_postulaciones_resumen AS
SELECT 
    p.id AS postulacion_id,
    v.titulo AS vacante,
    u.nombre_completo AS candidato,
    u.email,
    p.estado AS estado_postulacion,
    p.fecha_postulacion,
    (SELECT COUNT(*) FROM evaluaciones e WHERE e.postulacion_id = p.id) AS num_evaluaciones
FROM postulaciones p
JOIN vacantes v ON p.vacante_id = v.id
JOIN usuarios u ON p.candidato_id = u.id;
