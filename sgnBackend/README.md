# SIGECON Backend

Backend minimal para autenticación de `login` y `register` usando TypeScript y MySQL.

## Scripts

- `npm run dev` - iniciar servidor en modo desarrollo con recarga
- `npm run build` - transpilar TypeScript a `dist`
- `npm run start` - iniciar servidor desde `dist`

## Variables de entorno

Copia `.env.example` a `.env` y configura tu conexión a MySQL.

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

## Nota

La base de datos debe disponer de la tabla `users` para la autenticación. Usa el archivo `src/db/schema.sql` para crearla.
