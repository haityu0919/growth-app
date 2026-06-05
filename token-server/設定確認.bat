@echo off
chcp 65001 >nul
title DareTalk - Settings Check
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0check-settings.ps1"
echo.
pause
