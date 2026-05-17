@echo off
echo.
echo  Hub de Entretenimento — iniciando...
echo.

cd /d "%~dp0"

if not exist "node_modules" (
  echo  Primeira vez? Instalando dependencias...
  echo.
  npm install
  echo.
)

echo  Abrindo em http://localhost:5173
echo  Para encerrar: pressione Ctrl+C
echo.

npm run dev
