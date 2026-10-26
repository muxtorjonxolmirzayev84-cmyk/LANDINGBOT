@echo off
chcp 65001 >nul
cd /d "%~dp0"
title XMR Pizza - Ishlayapti

if not exist ".env" (
  echo [XATO] Avval "1-ORNATISH.bat" faylini oching.
  echo.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo [XATO] Paketlar ornatilmagan.
  echo Avval "1-ORNATISH.bat" faylini oching.
  echo.
  pause
  exit /b 1
)

echo ==================================================
echo    XMR Pizza ishga tushmoqda...
echo.
echo    Admin Panel:  http://localhost:5174
echo    Parol:        env faylidagi ADMIN_PASSWORD
echo.
echo    Telegram'da bot ishlashi uchun BU OYNA
echo    ochiq turishi kerak.
echo.
echo    Mini App'ni Telegram'ga ulash uchun ikkinchi
echo    oynada "3-NGROK.bat" faylini oching.
echo.
echo    Toxtatish: Ctrl + C
echo ==================================================
echo.

call npm run all
echo.
echo Dastur toxtadi.
pause
