@echo off
chcp 65001 >nul
title DareTalk - Preview store assets
cd /d "%~dp0"

set GEN=%USERPROFILE%\.cursor\projects\C-Users-matsuda-AppData-Local-Temp-9c7c4516-54e7-4adf-8cc6-a1965637edfa\assets

if exist "%GEN%\daretalk-app-icon-1024.png" (
  echo Opening NEW app icon...
  start "" "%GEN%\daretalk-app-icon-1024.png"
  start "" "%GEN%\daretalk-play-feature-1024x500.png"
) else if exist "app-icon-1024.png" (
  start "" "app-icon-1024.png"
  start "" "play-feature-graphic.png"
) else (
  echo Run apply-store-icon.bat first, or generate images in Cursor chat.
)

echo.
echo Opening CURRENT project icon and splash...
cd /d "%~dp0..\assets"
if exist icon.png start "" "icon.png"
if exist splash.png start "" "splash.png"

echo Done. Compare NEW vs CURRENT in Photos app.
pause
