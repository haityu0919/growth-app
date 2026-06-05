@echo off
chcp 65001 >nul
title DareTalk - Apply brand assets
cd /d "%~dp0"
node "%~dp0scripts\apply-brand-assets.cjs"
if errorlevel 1 goto :end
echo.
echo Optional: run optimize-pngs.bat to shrink PNG size.
echo Then restart Expo or rebuild dev client.
:end
pause
