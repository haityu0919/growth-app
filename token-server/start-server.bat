@echo off
title DareTalk Token Server
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

if not exist "%~dp0.env" (
    echo.
    echo ERROR: .env file not found in this folder.
    echo Copy .env.example to .env and add LiveKit keys.
    echo.
    pause
    exit /b 1
)

echo.
echo Starting DareTalk token server on port 3001...
echo Do not close this window.
echo.
node index.js
pause
