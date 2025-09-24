@echo off
echo Training Dropout Prediction Model with Fee Details
echo =================================================

cd /d "c:\Users\Arun kumar\Desktop\ERP\backend\ai"

echo Starting model training...
python dropout_prediction.py

echo.
echo Training completed successfully!
echo The model now includes fee details as a prediction factor.
echo.
echo Press any key to exit...
pause >nul