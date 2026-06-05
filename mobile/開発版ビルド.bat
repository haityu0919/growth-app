@echo off
chcp 65001 >nul
title DareTalk - Dev Build
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-dev-build.ps1"
echo.
pause
