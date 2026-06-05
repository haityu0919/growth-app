@echo off
chcp 65001 >nul
title DareTalk - Copy store screenshots
cd /d "%~dp0"
node "%~dp0scripts\copy-store-screenshots.cjs"
explorer "%~dp0store-assets\screenshots"
pause
