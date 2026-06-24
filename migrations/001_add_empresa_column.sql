-- Migración: Agregar columna 'empresa' a tabla 'usuarios'
-- Fecha: 2026-06-19
-- Descripción: Agrega el campo 'empresa' (VARCHAR(255)) a la tabla usuarios para persisistir información de la empresa del usuario durante el registro.

USE sigecon;

-- Verificar si la columna ya existe
ALTER TABLE usuarios
ADD COLUMN empresa VARCHAR(255) NULL COMMENT 'Nombre de la empresa (para reclutadores o referencia)';

-- Actualizar Sigecon.sql con esta definición
