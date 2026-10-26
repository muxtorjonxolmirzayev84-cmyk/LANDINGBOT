@echo off
chcp 65001 >nul
cd /d "%~dp0"
title XMR Pizza - Hammasi birdan

echo ==================================================
echo    XMR Pizza - avtomatik ishga tushirish
echo ==================================================
echo.

echo [1/5] Eski oynalar yopilmoqda...
taskkill /FI "WINDOWTITLE eq XMR Pizza server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq XMR Pizza tunnel*" /T /F >nul 2>&1
taskkill /IM cloudflared.exe /F >nul 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*_tunnel.ps1*' -or $_.CommandLine -like '*_watch.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1
call :freeport 4000
call :freeport 5173
call :freeport 5174
del /q tunnel-url.txt >nul 2>&1
del /q cf.log >nul 2>&1
echo.

echo [2/5] Tunnel dasturi tekshirilmoqda...
if exist "cloudflared.exe" (
  echo       Allaqachon bor.
) else (
  echo       Yuklab olinmoqda, 55 MB. Bir necha daqiqa ketishi mumkin...
  curl -L --max-time 900 -o "cloudflared.exe" https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
  if not exist "cloudflared.exe" goto dlfail
  echo       Tayyor.
)
echo.

echo [3/5] Internet manzili olinmoqda...
start "XMR Pizza tunnel" /MIN cmd /c "%~dp0_tunnel.cmd"
powershell -NoProfile -Command "for($i=0;$i -lt 150;$i++){ if(Test-Path 'tunnel-url.txt'){ $u=(Get-Content 'tunnel-url.txt' -Raw).Trim(); if($u){ Write-Host ('       Manzil: ' + $u); exit 0 } }; Start-Sleep -Seconds 1 }; exit 1"
if errorlevel 1 goto tunnelfail
echo.

echo [4/5] Server ishga tushmoqda...
start "XMR Pizza server" /D "%~dp0" cmd /k npm run all
echo       Yangi oynada ishlayapti.
echo.

echo [5/5] Tayyor!
echo.
echo ==================================================
echo    Telegram'da @xmr_pizza_bot ga /start yozing.
echo    Pastda "Menyu" tugmasi chiqadi.
echo.
echo    Admin Panel: http://localhost:5174
echo.
echo    MUHIM: "XMR Pizza server" va "XMR Pizza tunnel"
echo    oynalari ochiq tursin. Yopsangiz bot ishlamaydi.
echo ==================================================
echo.
pause
exit /b

:freeport
for /f "tokens=5" %%p in ('netstat -ano -p tcp ^| findstr /r /c:":%~1 .*LISTENING"') do (
  taskkill /PID %%p /T /F >nul 2>&1
)
exit /b 0

:dlfail
echo.
echo [XATO] Tunnel dasturi yuklab olinmadi. Internetni tekshiring.
echo.
pause
exit /b 1

:tunnelfail
echo.
echo [XATO] Internet manzili olinmadi. cf.log faylini tekshiring.
echo.
pause
exit /b 1
