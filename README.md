# SIGECON

Proyecto SIGECON: backend TypeScript + frontend React/Vite + MySQL.

## Estructura del repositorio

- `Sigecon-frontend/`: aplicación React con rutas de login/registro.
- `sgnBackend/`: servidor Express escrito en TypeScript.
- `Sigecon.sql`: esquema completo de la base de datos MySQL.

---

## Requisitos previos

- Node.js 18+ / npm 10+
- MySQL 8+
- Git (opcional)

---

## Instalación general

### 1. Instalar dependencias del frontend

```bash
cd Sigecon-frontend
npm install
```

### 2. Instalar dependencias del backend

```bash
cd ../sgnBackend
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tus datos de conexión MySQL:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=<tu_usuario>
DB_PASSWORD=<tu_contrasena>
DB_NAME=sigecon
JWT_SECRET=una_clave_segura
JWT_EXPIRES_IN=7d
```

### 4. Crear y cargar la base de datos

Importa el esquema desde `Sigecon.sql` en MySQL.

Linux / macOS:

```bash
mysql -u <tu_usuario> -p < Sigecon.sql
```

Windows (PowerShell):

```powershell
mysql -u <tu_usuario> -p < .\Sigecon.sql
```

> Si usas MySQL Workbench o phpMyAdmin, importa el archivo `Sigecon.sql` desde la interfaz.

---

## Ejecución del proyecto

### Backend

Desde `sgnBackend`:

```bash
npm run dev
```

Esto inicia el servidor en `http://localhost:4000` y verifica la conexión a MySQL.

### Frontend

Desde `Sigecon-frontend`:

```bash
npm run dev
```

Esto inicia Vite en `http://localhost:5173`.

---

## Pruebas manuales de autenticación

- Rutas backend:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- El frontend consume estas rutas desde `AuthContext.jsx`.
- Las credenciales de prueba incluidas en `Sigecon.sql` son:
  - `superadmin@empresa.com` / `12345678`
  - `rrhh@empresa.com` / `12345678`
  - `psicologo@empresa.com` / `12345678`
  - `juan.perez@example.com` / `12345678`

---

## Ajustes realizados

### Backend

- Conexión MySQL con `mysql2/promise`.
- Autenticación JWT en `src/utils/jwt.ts`.
- Registro/login reales con tablas `roles` y `usuarios`.
- Servicio de usuario para consulta e inserción de datos con `src/services/userService.ts`.
- Inicialización de roles predeterminados en `src/db/initRoles.ts`.
- Middleware de autenticación JWT en `src/middlewares/authMiddleware.ts`.
- Configuración TypeScript y scripts de desarrollo multiplataforma.

### Frontend

- `AuthContext.jsx` actualizado para llamar a backend real.
- `LoginForm.jsx` y `RegisterForm.jsx` usan `await` correctamente.
- Login demo ajustado a credenciales reales del esquema SQL.
- `VITE_API_URL` configurado para apuntar a `http://localhost:4000`.

---

## Consideraciones para migrar a otro equipo

### Linux

1. Clona el repositorio.
2. Instala Node.js y MySQL.
3. Copia `.env.example` a `.env`.
4. Importa `Sigecon.sql`.
5. Ejecuta `npm install` en `Sigecon-frontend` y `sgnBackend`.
6. Inicia backend y frontend con `npm run dev`.

### Windows

1. Clona el repositorio.
2. Instala Node.js y MySQL.
3. Copia `.env.example` a `.env`.
4. Importa `Sigecon.sql` con PowerShell o MySQL Workbench.
5. Ejecuta `npm install` en ambos directorios.
6. Inicia backend y frontend con `npm run dev`.

> En Windows usa `cross-env` para variables de entorno multiplataforma; ya está incluido en `sgnBackend`.

---

## Aportes significativos futuros

### Frontend

- Implementar validación de formularios con librería (`react-hook-form`, `zod`).
- Añadir rutas protegidas para roles y separar paneles por tipo de usuario.
- Soporte para carga de archivos y preview de CV.
- Diseño responsive completo para móviles.

### Backend

- Añadir endpoints de perfil de usuario, roles y permisos.
- Crear controlador de `password_resets` con envío de email.
- Añadir endpoints CRUD para vacantes, postulaciones y pruebas.
- Implementar paginación, filtros, búsqueda y cache.
- Añadir pruebas unitarias e integración con Jest.

### Seguridad

- Forzar HTTPS y políticas de CORS estrictas.
- Usar refresh tokens / rotación de tokens.
- Validar y sanitizar todos los datos recibidos.
- Limitar intentos de login y proteger contra ataques de fuerza bruta.
- Cifrar secretos con vault / variables de entorno seguras.

### Infraestructura

- Desplegar backend en contenedor Docker.
- Usar CI/CD para pruebas y despliegue.
- Configurar monitoreo y logging centralizado.

---

## Notas finales

- El proyecto ya cuenta con el flujo de login/registro funcional.
- La base de datos `Sigecon.sql` define el esquema completo necesario para avanzar.
- Para continuar se recomienda priorizar la lógica de roles y el acceso a módulos internos.
