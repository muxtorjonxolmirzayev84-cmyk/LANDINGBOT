@echo off
chcp 65001 >nul
cd /d "%~dp0"
title XMR Pizza - ngrok

where ngrok >nul 2>nul
if errorlevel 1 (
  echo [XATO] ngrok topilmadi.
  echo.
  echo Nima qilish kerak:
  echo   1. https://ngrok.com saytida royxatdan oting (bepul)
  echo   2. ngrok dasturini yuklab oling va ornating
  echo   3. Dashboard'dagi "Your Authtoken" ni nusxalang
  echo   4. cmd oynasida bajaring:
  echo        ngrok config add-authtoken SIZNING_TOKENINGIZ
  echo   5. Shu faylni yana oching
  echo.
  echo Batafsil: ISHGA_TUSHIRISH.md faylining 4-bolimi
  echo.
  pause
  exit /b 1
)

echo ==================================================
echo    ngrok ishga tushmoqda...
echo.
echo    "2-ISHGA-TUSHIRISH.bat" oynasi ochiq turishi shart.
echo    10 soniyadan keyin botdagi "Menyu" tugmasi ishlaydi.
echo.
echo    Toxtatish: Ctrl + C
echo ==================================================
echo.

ngrok http 127.0.0.1:5173
pause
