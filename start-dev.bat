@echo off
echo.
echo 🚀 Starting ERP System Development Environment...
echo.

:: Check if MongoDB is running
echo 🔍 Checking MongoDB...
netstat -an | findstr :27017 >nul
if %errorlevel% == 0 (
    echo ✅ MongoDB is running on port 27017
) else (
    echo ❌ MongoDB is not running!
    echo.
    echo Please start MongoDB using one of these methods:
    echo 1. Start MongoDB service: net start MongoDB
    echo 2. Install MongoDB from: https://www.mongodb.com/try/download/community
    echo 3. See MONGODB_LOCAL_SETUP.md for detailed instructions
    echo.
    pause
    exit /b 1
)

:: Check dependencies
echo.
echo 🔍 Checking dependencies...
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

echo ✅ Dependencies checked!

:: Information
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
echo.
echo Sample Login Credentials:
echo Student: student001 / Password123
echo Faculty: prof.smith / Password123
echo Admin: admin / Admin123
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start development servers
npm run dev

pause