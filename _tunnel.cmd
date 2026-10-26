@echo off
chcp 65001 >nul
cd /d "%~dp0"
title XMR Pizza tunnel
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0_tunnel.ps1"
pause
