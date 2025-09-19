# ERP System Development Startup Script

Write-Host "🚀 Starting ERP System Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if a service is running
function Test-ServiceRunning {
    param($ServiceName)
    try {
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        return $service -and $service.Status -eq 'Running'
    }
    catch {
        return $false
    }
}

# Function to check if port is in use
function Test-Port {
    param($Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

# Check MongoDB Service
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow

if (Test-ServiceRunning "MongoDB") {
    Write-Host "✅ MongoDB service is running" -ForegroundColor Green
}
elseif (Test-Port 27017) {
    Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
}
else {
    Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start MongoDB using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Start MongoDB service: net start MongoDB" -ForegroundColor White
    Write-Host "2. Install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "3. Or run MongoDB manually from installation directory" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Do you want to try starting MongoDB service? (y/N)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Write-Host "🔄 Attempting to start MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service -Name "MongoDB" -ErrorAction Stop
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
            Start-Sleep -Seconds 3
        }
        catch {
            Write-Host "❌ Failed to start MongoDB service. Please install MongoDB or start it manually." -ForegroundColor Red
            Write-Host "See MONGODB_LOCAL_SETUP.md for installation instructions." -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
    else {
        Write-Host "Please start MongoDB manually and run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if ports are available
Write-Host ""
Write-Host "🔍 Checking ports..." -ForegroundColor Yellow

if (Test-Port 5000) {
    Write-Host "⚠️  Port 5000 is already in use" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Port 5000 is available for backend" -ForegroundColor Green
}

if (Test-Port 5173) {
    Write-Host "⚠️  Port 5173 is already in use" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Port 5173 is available for frontend" -ForegroundColor Green
}

# Check if node_modules exist
Write-Host ""
Write-Host "🔍 Checking dependencies..." -ForegroundColor Yellow

$needsInstall = $false

if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Root dependencies not installed" -ForegroundColor Red
    $needsInstall = $true
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "❌ Frontend dependencies not installed" -ForegroundColor Red
    $needsInstall = $true
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "❌ Backend dependencies not installed" -ForegroundColor Red
    $needsInstall = $true
}

if ($needsInstall) {
    Write-Host ""
    $choice = Read-Host "Install missing dependencies? This may take a few minutes. (Y/n)"
    if ($choice -ne 'n' -and $choice -ne 'N') {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm run install:all
        Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Some dependencies may be missing. Install them with: npm run install:all" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✅ All dependencies are installed" -ForegroundColor Green
}

# Test MongoDB connection
Write-Host ""
Write-Host "🔍 Testing MongoDB connection..." -ForegroundColor Yellow

try {
    $testConnection = node -e "
        const mongoose = require('./backend/node_modules/mongoose');
        mongoose.connect('mongodb://localhost:27017/erp_system', { serverSelectionTimeoutMS: 3000 })
            .then(() => { console.log('✅ MongoDB Connected'); process.exit(0); })
            .catch(err => { console.error('❌ MongoDB Connection Failed:', err.message); process.exit(1); });
    " 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB connection successful" -ForegroundColor Green
    }
    else {
        Write-Host "❌ MongoDB connection failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "⚠️  Could not test MongoDB connection" -ForegroundColor Yellow
}

# Ask about seeding database
Write-Host ""
$seedChoice = Read-Host "Do you want to seed the database with sample data? (y/N)"
if ($seedChoice -eq 'y' -or $seedChoice -eq 'Y') {
    Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
    cd backend
    npm run seed
    cd ..
    Write-Host "✅ Database seeded with sample data!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Sample Login Credentials:" -ForegroundColor Cyan
    Write-Host "Student: student001 / Password123" -ForegroundColor White
    Write-Host "Faculty: prof.smith / Password123" -ForegroundColor White
    Write-Host "Admin: admin / Admin123" -ForegroundColor White
}

# Start the application
Write-Host ""
Write-Host "🚀 Starting frontend and backend..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both frontend and backend
npm run dev