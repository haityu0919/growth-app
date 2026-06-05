@echo off
chcp 65001 >nul
title DareTalk - Expo Recovery
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-qr-recovery.ps1"
echo.
pause
