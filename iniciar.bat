@echo off
setlocal enabledelayedexpansion
title Analizador de Textos IA
echo ============================================
echo   Analizador de Textos IA - Instalacion
echo ============================================
echo.

where node >nul 2>nul
if !errorlevel! neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Descargalo aqui: https://nodejs.org/
    echo Instala la version LTS y vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b
)

echo [OK] Node.js encontrado
echo.

where pnpm >nul 2>nul
if !errorlevel! neq 0 (
    echo Instalando pnpm...
    call npm install -g pnpm
    echo [OK] pnpm instalado
) else (
    echo [OK] pnpm encontrado
)

echo.

if exist .env.ship (
    if not exist .env (
        rename .env.ship .env
    ) else (
        del .env.ship
    )
)

if not exist .env (
    echo HUGGINGFACE_API_KEY=>.env
)

set "TOKEN_OK=0"
for /f "usebackq tokens=2 delims==" %%a in (".env") do (
    set "VAL=%%a"
    if defined VAL (
        echo !VAL! | findstr /C:"hf_" >nul 2>nul
        if !errorlevel! equ 0 set "TOKEN_OK=1"
    )
)

if "!TOKEN_OK!"=="0" (
    echo ============================================
    echo   Configuracion del token
    echo ============================================
    echo.
    echo No se encontro un token valido en el archivo .env
    echo.
    echo Puedes configurarlo de dos formas:
    echo   1. Pegarlo aqui abajo
    echo   2. Abrir el archivo .env con un editor y escribirlo manualmente
    echo.
    echo Si no tienes un token, crealo gratis en:
    echo https://huggingface.co/settings/tokens [Tipo "Read"]
    echo.
    set /p "HF_TOKEN=Pega tu token de Hugging Face aqui: "
    if defined HF_TOKEN (
        echo HUGGINGFACE_API_KEY=!HF_TOKEN!>.env
        echo.
        echo [OK] Token guardado en .env
    ) else (
        echo.
        echo [ERROR] No se ingreso ningun token.
        echo Abre el archivo .env y pega tu token manualmente.
        echo.
        pause
        exit /b
    )
)

echo.
echo [OK] Token de Hugging Face configurado
echo.
echo Instalando dependencias... [esto puede tardar unos minutos]
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist node_modules rmdir /s /q node_modules
for /d %%i in (artifacts\*) do if exist "%%i\node_modules" rmdir /s /q "%%i\node_modules"
for /d %%i in (lib\*) do if exist "%%i\node_modules" rmdir /s /q "%%i\node_modules"
call pnpm install --no-frozen-lockfile --force
echo.
echo [OK] Dependencias instaladas
echo.
echo ============================================
echo   Iniciando la aplicacion...
echo   Espera a que ambas ventanas digan que estan listas.
echo   Luego abre en tu navegador: http://localhost:5173
echo ============================================
echo.

start "Backend" cmd /k "cd /d "%~dp0" && pnpm --filter @workspace/api-server run dev"
timeout /t 5 /nobreak >nul
start "Frontend" cmd /k "cd /d "%~dp0" && pnpm --filter @workspace/text-insight run dev"

echo.
echo Las dos ventanas del servidor se abrieron.
echo Abre en tu navegador: http://localhost:5173
echo.
echo Para detener la aplicacion, cierra las ventanas del servidor.
echo.
pause
