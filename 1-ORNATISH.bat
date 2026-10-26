@echo off
chcp 65001 >nul
cd /d "%~dp0"
title XMR Pizza - Ornatish
echo ==================================================
echo    XMR Pizza - ORNATISH (faqat bir marta)
echo ==================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [XATO] Node.js topilmadi.
  echo.
  echo Nima qilish kerak:
  echo   1. https://nodejs.org saytini oching
  echo   2. Katta yashil "LTS" tugmasini bosib yuklab oling
  echo   3. Next - Next - Install qilib ornating
  echo   4. Kompyuterni qayta yoqing
  echo   5. Shu faylni yana ikki marta bosing
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo Node.js: %%v
echo.

if exist ".env" (
  echo [OK] Sozlamalar fayli joyida.
) else (
  if exist "env.txt" (
    ren "env.txt" ".env"
    echo [OK] env.txt fayli .env nomini oldi.
  ) else (
    echo [XATO] env.txt ham, .env ham topilmadi.
    echo Claude'ga shu haqda yozing.
    pause
    exit /b 1
  )
)
echo.

echo --------------------------------------------------
echo  1/4  Asosiy paketlar ornatilmoqda... (2-5 daqiqa)
echo --------------------------------------------------
call npm install
if errorlevel 1 goto fail

echo.
echo --------------------------------------------------
echo  2/4  Mini App paketlari...
echo --------------------------------------------------
call npm install --prefix miniapp
if errorlevel 1 goto fail

echo.
echo --------------------------------------------------
echo  3/4  Admin Panel paketlari...
echo --------------------------------------------------
call npm install --prefix admin
if errorlevel 1 goto fail

echo.
echo --------------------------------------------------
echo  4/4  Baza tayyorlanmoqda va pizzalar yozilmoqda...
echo --------------------------------------------------
call npm run db:setup
if errorlevel 1 goto faildb

echo.
echo ==================================================
echo    TAYYOR!
echo.
echo    Endi "2-ISHGA-TUSHIRISH.bat" faylini oching.
echo ==================================================
echo.
pause
exit /b 0

:faildb
echo.
echo [XATO] Bazaga ulanib bolmadi.
echo Internetingizni tekshiring. Muammo qolsa, yuqoridagi matnni
echo suratga olib Claude'ga yuboring.
echo.
pause
exit /b 1

:fail
echo.
echo [XATO] Paketlarni ornatib bolmadi.
echo Yuqoridagi matnni suratga olib Claude'ga yuboring.
echo.
pause
exit /b 1
