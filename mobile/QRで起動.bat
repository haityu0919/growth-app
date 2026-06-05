@echo off
chcp 65001 >nul
title DareTalk - Expo (QR)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-qr.ps1"
echo.
pause
