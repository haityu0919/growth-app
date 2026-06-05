@echo off
cd /d "%~dp0.."
node scripts\apply-brand-assets.cjs > apply-brand-log.txt 2>&1
type apply-brand-log.txt
