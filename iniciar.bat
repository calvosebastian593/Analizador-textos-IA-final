@echo off
echo ============================================
echo   Analizador de Textos IA - Instalacion
echo ============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Descargalo aqui: https://nodejs.org/
    echo Instala la version LTS y vuelve a ejecutar este archivo.
    pause
    exit /b
)

echo [OK] Node.js encontrado
echo.

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando pnpm...
    call npm install -g pnpm
    echo [OK] pnpm instalado
) else (
    echo [OK] pnpm encontrado
)

echo.

if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [AVISO] Se creo el archivo .env desde .env.example
        echo IMPORTANTE: Abre el archivo .env con un editor de texto
        echo y reemplaza "tu_api_key_aqui" con tu token de Hugging Face.
        echo Obten tu token en: https://huggingface.co/settings/tokens
        echo.
        pause
        exit /b
    )
)

echo Instalando dependencias... (esto puede tardar unos minutos)
if exist pnpm-lock.yaml (del pnpm-lock.yaml)
if exist node_modules (rmdir /s /q node_modules)
call pnpm install --no-frozen-lockfile
echo.
echo [OK] Dependencias instaladas
echo.
echo ============================================
echo   Iniciando la aplicacion...
echo   Espera a que ambas ventanas digan que estan listas.
echo   Luego abre en tu navegador: http://localhost:5173
echo ============================================
echo.

start "Backend" cmd /k "pnpm --filter @workspace/api-server run dev"
timeout /t 5 /nobreak >nul
start "Frontend" cmd /k "pnpm --filter @workspace/text-insight run dev"

echo.
echo Las dos ventanas del servidor se abrieron.
echo Abre en tu navegador: http://localhost:5173
echo.
echo Para detener la aplicacion, cierra las ventanas del servidor.
pause
