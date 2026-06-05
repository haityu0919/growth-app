@echo off
chcp 65001 >nul
title DareTalk - Dev Client (LAN)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-expo-devclient.ps1"
echo.
pause
