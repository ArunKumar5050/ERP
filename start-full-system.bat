@echo off
echo Starting Full ERP System with AI Dropout Prediction Module
echo =========================================================

echo Starting MongoDB (make sure it's installed as a service)...
net start MongoDB

echo Starting Main ERP Backend...
cd /d "c:\Users\Arun kumar\Desktop\ERP\backend"
start "ERP Backend" npm start

echo Starting AI Dropout Prediction Service...
cd /d "c:\Users\Arun kumar\Desktop\ERP\backend\ai"
start "AI Service" python api.py

echo.
echo Both services started successfully!
echo ERP Backend running on http://localhost:5000
echo AI Service running on http://localhost:5001
echo.
echo Press any key to exit...
pause >nul