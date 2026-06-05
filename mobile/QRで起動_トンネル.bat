@echo off
chcp 65001 >nul
title DareTalk - Expo Tunnel
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-qr-tunnel.ps1"
echo.
pause
