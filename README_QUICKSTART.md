# SIGECON - Guía rápida

Esta guía corta explica lo mínimo necesario para arrancar el proyecto en un nuevo equipo y subirlo a GitHub, sin tocar el `README.md` principal.

## 1. Instalar dependencias

```bash
cd sgnBackend
npm install

cd ../Sigecon-frontend
npm install
```

## 2. Configurar la base de datos

En `sgnBackend` copia el archivo de ejemplo y edítalo:

```powershell
cd sgnBackend
copy .env.example .env
```

Modifica `sgnBackend/.env` con tus datos reales:

```bash
DB_HOST=localhost
DB_PORT=3307
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sigecon
```

## 3. Probar la conexión a la DB

```bash
cd sgnBackend
node scripts/check-db.js
```

Si el script devuelve `OK: DB reachable`, la conexión está lista.

## 4. Iniciar el proyecto

```bash
cd sgnBackend
npm run dev
```

Abre en el navegador:

```bash
http://localhost:4000
```

## 5. Probar registro y login

- Registro: `POST /api/auth/register`
- Login: `POST /api/auth/login`

## 6. Subir a GitHub

```bash
git init
git add .
git commit -m "Inicializar SIGECON"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### Recomendaciones

- No subas `sgnBackend/.env` al repositorio.
- Usa `.env.example` como referencia.
- Agrega un `.gitignore` con:

```gitignore
node_modules/
dist/
Sigecon-frontend/node_modules/
Sigecon-frontend/dist/
sgnBackend/.env
```
