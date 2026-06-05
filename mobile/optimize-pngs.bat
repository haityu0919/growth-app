@echo off
chcp 65001 >nul
title DareTalk - Optimize PNGs
cd /d "%~dp0"

echo [1/2] Trying sharp (better compression)...
call npm install --no-save sharp >nul 2>&1
if exist node_modules\sharp (
  node scripts\optimize-pngs.cjs
  call npm uninstall sharp >nul 2>&1
  if exist node_modules\sharp rmdir /s /q node_modules\sharp 2>nul
  if exist node_modules\@img\sharp-win32-x64 rmdir /s /q node_modules\@img\sharp-win32-x64 2>nul
  goto :done
)

echo [2/2] sharp unavailable - using PowerShell resize...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\optimize-pngs.ps1"

:done
if exist optimize-pngs-log.txt type optimize-pngs-log.txt
echo.
echo Finished. Restart Expo if running.
pause
