@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul || echo No Node.js processes found.
echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak > nul
echo.
echo You can now run: npm run dev
echo.
pause