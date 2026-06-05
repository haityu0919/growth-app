@echo off
chcp 65001 >nul
title DareTalk - Approval waiting tasks (1-7)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-approval-waiting-tasks.ps1"
echo.
if exist approval-waiting-log.txt type approval-waiting-log.txt
pause
