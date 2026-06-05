@echo off
chcp 65001 >nul
title DareTalk - Compact
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0compact-project.ps1"
echo.
pause
