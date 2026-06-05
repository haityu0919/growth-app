@echo off
chcp 65001 >nul
title DareTalk - Railway Health Check
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0railway-deploy-check.ps1" %*
echo.
pause
