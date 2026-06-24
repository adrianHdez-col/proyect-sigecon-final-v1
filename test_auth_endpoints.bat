@echo off
REM Script de prueba para endpoints de autenticación
REM Ejecutar desde PowerShell o CMD después de iniciar el backend (npm run dev)

echo.
echo ========================================
echo PRUEBAS DE ENDPOINTS DE AUTENTICACION
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Variables
set BASE_URL=http://localhost:4000
set CONTENT_TYPE=Content-Type: application/json

echo [1] Verificando health endpoint...
echo.
curl -s %BASE_URL%/api/health
echo.
echo.

echo [2] Registrando nuevo usuario de prueba...
echo.
curl -s -X POST %BASE_URL%/api/auth/register ^
  -H "%CONTENT_TYPE%" ^
  -d "{\"fullName\":\"Test User\",\"email\":\"test.user@example.com\",\"password\":\"12345678\",\"role\":\"aspirant\",\"company\":\"Test Company\"}"
echo.
echo.

echo [3] Intentando login con usuario registrado...
echo.
curl -s -X POST %BASE_URL%/api/auth/login ^
  -H "%CONTENT_TYPE%" ^
  -d "{\"email\":\"test.user@example.com\",\"password\":\"12345678\"}"
echo.
echo.

echo [4] Intentando login con usuario demo (si existe en BD)...
echo.
curl -s -X POST %BASE_URL%/api/auth/login ^
  -H "%CONTENT_TYPE%" ^
  -d "{\"email\":\"superadmin@empresa.com\",\"password\":\"12345678\"}"
echo.
echo.

echo [5] Intentando login con credenciales invalidas...
echo.
curl -s -X POST %BASE_URL%/api/auth/login ^
  -H "%CONTENT_TYPE%" ^
  -d "{\"email\":\"test.user@example.com\",\"password\":\"wrongpassword\"}"
echo.
echo.

echo ========================================
echo PRUEBAS COMPLETADAS
echo ========================================
echo.
echo Verifica que:
echo - [1] Devuelve {status: ok}
echo - [2] Devuelve success: true con company: "Test Company"
echo - [3] Devuelve success: true con el token
echo - [4] Devuelve success: true si existe el usuario demo
echo - [5] Devuelve success: false (credenciales inválidas)
echo.
