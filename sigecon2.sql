   CREATE DATABASE IF NOT EXISTS sigecon;
   USE sigecon;

-- ======================================================
-- TABLA EMPRESAS (NUEVA)
-- ======================================================
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    logo_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nit (nit),
    INDEX idx_activo (activo)
);



-- 1. Roles 
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'SU, RRHH, Evaluador, Candidato',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Usuarios 
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    empresa_id INT NULL COMMENT 'NULL para SU o candidatos externos',
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
    INDEX idx_empresa (empresa_id),
    INDEX idx_rol (rol_id)
);

-- 3. Permisos 
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 4. Relación roles-permisos 
CREATE TABLE rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

-- 5. Recuperación de contraseña 
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token)
);

-- 6. Hojas de vida 
CREATE TABLE hojas_vida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    perfil_profesional TEXT,
    habilidades TEXT,
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

-- 8. Estudios 
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
    empresa_id INT NOT NULL,
    creador_id INT NOT NULL COMMENT 'Usuario RRHH de la misma empresa',
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
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_empresa (empresa_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_limite (fecha_limite)
);

-- 10. Postulaciones 
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

-- 11. Pruebas 
CREATE TABLE pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    creador_id INT NOT NULL COMMENT 'Usuario RRHH de la misma empresa',
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('tecnica', 'psicotecnica') NOT NULL,
    duracion_minutos INT DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_empresa (empresa_id)
);

-- 12. Banco de preguntas 
CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prueba_id INT NOT NULL,
    texto TEXT NOT NULL,
    tipo ENUM('multiple', 'abierta', 'logica', 'personalidad') NOT NULL,
    opciones JSON COMMENT 'para preguntas múltiples: [{"opcion":"A","texto":"..."}]',
    peso DECIMAL(5,2) DEFAULT 1.00,
    orden INT DEFAULT 0,
    FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE CASCADE,
    INDEX idx_prueba (prueba_id)
);

-- 13. Respuestas posibles 
CREATE TABLE respuestas_posibles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id INT NOT NULL,
    texto_respuesta TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    valor_puntaje DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);

-- 14. Resultados de pruebas 
CREATE TABLE resultados_pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id INT NOT NULL,
    prueba_id INT NOT NULL,
    fecha_realizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_total DECIMAL(10,2),
    respuestas_json JSON,
    perfil_generado TEXT,
    estado ENUM('pendiente', 'completado', 'calificado') DEFAULT 'pendiente',
    comentarios_evaluador TEXT,
    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE RESTRICT,
    INDEX idx_postulacion (postulacion_id)
);

-- 15. Inducciones 
CREATE TABLE inducciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    vacante_id INT NULL COMMENT 'Puede ser específica de una vacante o general',
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    contenido TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    puntaje_minimo_aprobacion DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE SET NULL,
    INDEX idx_empresa (empresa_id)
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

-- 17. Gestión documental 
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

-- 18. Evaluaciones 
CREATE TABLE evaluaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id INT NOT NULL,
    evaluador_id INT NOT NULL,
    criterio VARCHAR(100),
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

-- Insertar roles (sin cambios)
INSERT INTO roles (nombre, descripcion) VALUES
('SU', 'Super Administrador - control total del sistema'),
('RRHH', 'Administrador de Recursos Humanos - gestión de vacantes y candidatos'),
('Evaluador', 'Psicólogo o evaluador técnico'),
('Candidato', 'Aspirante a vacantes');

-- Insertar permisos (sin cambios)
INSERT INTO permisos (nombre, descripcion) VALUES
('crear_vacante', 'Permite crear nuevas vacantes'),
('editar_vacante', 'Permite modificar vacantes'),
('cerrar_vacante', 'Permite cerrar convocatorias'),
('ver_reportes', 'Acceso a reportes y métricas'),
('gestionar_usuarios', 'Crear, editar, deshabilitar usuarios'),
('asignar_pruebas', 'Asignar pruebas técnicas/psicotécnicas a candidatos'),
('evaluar_resultados', 'Calificar y emitir concepto de pruebas'),
('configurar_induccion', 'Configurar módulos de inducción');

-- Asignar permisos a roles (SU todos, RRHH algunos, Evaluador específicos)
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre='SU'), id FROM permisos;

INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
((SELECT id FROM roles WHERE nombre='RRHH'), 1),
((SELECT id FROM roles WHERE nombre='RRHH'), 2),
((SELECT id FROM roles WHERE nombre='RRHH'), 3),
((SELECT id FROM roles WHERE nombre='RRHH'), 4),
((SELECT id FROM roles WHERE nombre='RRHH'), 6),
((SELECT id FROM roles WHERE nombre='RRHH'), 8);

INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
((SELECT id FROM roles WHERE nombre='Evaluador'), 4),
((SELECT id FROM roles WHERE nombre='Evaluador'), 7);

-- Insertar empresas de ejemplo
INSERT INTO empresas (nombre, nit, direccion, telefono, email, logo_url, activo) VALUES
('TechCorp S.A.S.', '900123456-7', 'Calle 123 #45-67, Bogotá', '601-5551234', 'contacto@techcorp.com', 'https://techcorp.com/logo.png', TRUE),
('Soluciones RH Ltda.', '800987654-3', 'Carrera 78 #12-34, Medellín', '604-5555678', 'info@solucionesrh.com', 'https://solucionesrh.com/logo.png', TRUE);

-- Usuarios de prueba (contraseña: 12345678)
-- Nota: El hash es de bcrypt con costo 10 para "12345678". Reemplazar en producción.
INSERT INTO usuarios (rol_id, empresa_id, email, password_hash, nombre_completo, telefono, activo) VALUES
-- Super Administrador (sin empresa)
( (SELECT id FROM roles WHERE nombre='SU'), NULL, 'superadmin@empresa.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Super Administrador', '555-0001', TRUE),
-- RRHH de TechCorp
( (SELECT id FROM roles WHERE nombre='RRHH'), (SELECT id FROM empresas WHERE nit='900123456-7'), 'rrhh@techcorp.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Laura Gómez', '555-1234', TRUE),
-- Evaluador de TechCorp
( (SELECT id FROM roles WHERE nombre='Evaluador'), (SELECT id FROM empresas WHERE nit='900123456-7'), 'psicologo@techcorp.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Carlos Méndez', '555-5678', TRUE),
-- Candidatos externos (sin empresa)
( (SELECT id FROM roles WHERE nombre='Candidato'), NULL, 'juan.perez@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'Juan Pérez', '555-8765', TRUE),
( (SELECT id FROM roles WHERE nombre='Candidato'), NULL, 'maria.lopez@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuMv7JH.1Q6pFqZqyH3L9HnZ6x6K', 'María López', '555-4321', TRUE);

-- Hojas de vida para candidatos
INSERT INTO hojas_vida (usuario_id, fecha_nacimiento, direccion, perfil_profesional, habilidades) VALUES
( (SELECT id FROM usuarios WHERE email='juan.perez@example.com'), '1990-05-15', 'Calle 123, Bogotá', 'Ingeniero de sistemas con 5 años de experiencia', 'Python, Java, SQL, React'),
( (SELECT id FROM usuarios WHERE email='maria.lopez@example.com'), '1992-08-22', 'Carrera 45 #12-34, Medellín', 'Administradora de empresas, especialista en RRHH', 'Gestión de talento, reclutamiento, comunicación');

-- Experiencias
INSERT INTO experiencias (hoja_vida_id, empresa, cargo, fecha_inicio, fecha_fin, descripcion, actual) VALUES
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='juan.perez@example.com')), 'Tech Solutions', 'Desarrollador Full Stack', '2019-01-01', '2023-12-31', 'Desarrollo de aplicaciones web', FALSE),
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='maria.lopez@example.com')), 'Grupo Empresarial', 'Asistente de RRHH', '2020-03-10', NULL, 'Apoyo en procesos de selección', TRUE);

-- Estudios
INSERT INTO estudios (hoja_vida_id, institucion, titulo, fecha_inicio, fecha_fin, descripcion) VALUES
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='juan.perez@example.com')), 'Universidad Nacional', 'Ingeniería de Sistemas', '2012-02-01', '2018-06-30', 'Pregrado'),
( (SELECT id FROM hojas_vida WHERE usuario_id=(SELECT id FROM usuarios WHERE email='maria.lopez@example.com')), 'Universidad de Antioquia', 'Administración de Empresas', '2011-02-01', '2016-12-15', 'Pregrado');

-- Vacante de ejemplo (asociada a TechCorp)
INSERT INTO vacantes (empresa_id, creador_id, titulo, area, salario, tipo_contrato, modalidad, descripcion, requisitos, fecha_limite, estado)
VALUES (
    (SELECT id FROM empresas WHERE nit='900123456-7'),
    (SELECT id FROM usuarios WHERE email='rrhh@techcorp.com'),
    'Desarrollador Full Stack',
    'Tecnología',
    4500000.00,
    'Tiempo completo',
    'Remoto',
    'Desarrollo de aplicaciones web con React y Node.js',
    'Experiencia comprobada en JavaScript, manejo de bases de datos, título profesional',
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'abierta'
);

-- Postulación de Juan Pérez a la vacante
INSERT INTO postulaciones (vacante_id, candidato_id, estado)
VALUES (
    (SELECT id FROM vacantes WHERE titulo='Desarrollador Full Stack' AND empresa_id=(SELECT id FROM empresas WHERE nit='900123456-7')),
    (SELECT id FROM usuarios WHERE email='juan.perez@example.com'),
    'postulado'
);

-- Prueba técnica de ejemplo (asociada a TechCorp)
INSERT INTO pruebas (empresa_id, creador_id, titulo, descripcion, tipo, duracion_minutos)
VALUES (
    (SELECT id FROM empresas WHERE nit='900123456-7'),
    (SELECT id FROM usuarios WHERE email='rrhh@techcorp.com'),
    'Prueba Técnica - JavaScript',
    'Evaluación de conocimientos en JS y Node.js',
    'tecnica',
    60
);

-- Preguntas de la prueba
INSERT INTO preguntas (prueba_id, texto, tipo, opciones, peso, orden)
SELECT
    (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript' AND empresa_id=(SELECT id FROM empresas WHERE nit='900123456-7')),
    '¿Cuál es la salida de console.log(typeof null)?',
    'multiple',
    '[{"opcion":"A","texto":"null"},{"opcion":"B","texto":"object"},{"opcion":"C","texto":"undefined"},{"opcion":"D","texto":"number"}]',
    2.0,
    1
UNION ALL
SELECT
    (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript' AND empresa_id=(SELECT id FROM empresas WHERE nit='900123456-7')),
    'Explica el concepto de closures en JavaScript',
    'abierta',
    NULL,
    3.0,
    2;

-- Respuestas posibles para la pregunta múltiple
INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'object', TRUE, 2.0
FROM preguntas p
WHERE p.texto LIKE '%typeof null%' AND p.prueba_id = (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript');

INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'null', FALSE, 0
FROM preguntas p
WHERE p.texto LIKE '%typeof null%' AND p.prueba_id = (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript');

INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'undefined', FALSE, 0
FROM preguntas p
WHERE p.texto LIKE '%typeof null%' AND p.prueba_id = (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript');

INSERT INTO respuestas_posibles (pregunta_id, texto_respuesta, es_correcta, valor_puntaje)
SELECT p.id, 'number', FALSE, 0
FROM preguntas p
WHERE p.texto LIKE '%typeof null%' AND p.prueba_id = (SELECT id FROM pruebas WHERE titulo='Prueba Técnica - JavaScript');

-- Inducción de ejemplo (asociada a TechCorp)
INSERT INTO inducciones (empresa_id, vacante_id, titulo, descripcion, contenido, fecha_inicio, fecha_fin, puntaje_minimo_aprobacion)
VALUES (
    (SELECT id FROM empresas WHERE nit='900123456-7'),
    (SELECT id FROM vacantes WHERE titulo='Desarrollador Full Stack' AND empresa_id=(SELECT id FROM empresas WHERE nit='900123456-7')),
    'Inducción para nuevos desarrolladores',
    'Políticas internas, herramientas de trabajo y cultura empresarial',
    'https://techcorp.com/induccion/video1',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    70.00
);

-- Documento de ejemplo
INSERT INTO documentos (usuario_id, postulacion_id, nombre_archivo, ruta_almacenamiento, tipo_documento)
VALUES (
    (SELECT id FROM usuarios WHERE email='juan.perez@example.com'),
    (SELECT id FROM postulaciones LIMIT 1),
    'Juan_Perez_CV.pdf',
    '/documentos/cvs/juan_perez.pdf',
    'hoja_vida_pdf'
);

-- ======================================================
-- VISTA ÚTIL: Resumen de postulaciones con datos de empresa y candidato
-- ======================================================
CREATE OR REPLACE VIEW vista_postulaciones_resumen AS
SELECT 
    p.id AS postulacion_id,
    v.titulo AS vacante,
    e.nombre AS empresa,
    u.nombre_completo AS candidato,
    u.email,
    p.estado AS estado_postulacion,
    p.fecha_postulacion,
    (SELECT COUNT(*) FROM evaluaciones ev WHERE ev.postulacion_id = p.id) AS num_evaluaciones
FROM postulaciones p
JOIN vacantes v ON p.vacante_id = v.id
JOIN empresas e ON v.empresa_id = e.id
JOIN usuarios u ON p.candidato_id = u.id;

