# Local MongoDB Setup Guide

## MongoDB Installation on Windows

### Method 1: Download from MongoDB Website (Recommended)

1. **Download MongoDB Community Server:**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select:
     - Version: Latest
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important**: Check "Install MongoDB as a Service"
   - **Important**: Check "Install MongoDB Compass" (GUI tool)
   - Complete the installation

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Or manually start the service
   net start MongoDB
   ```

### Method 2: Using Chocolatey (If you have Chocolatey installed)

```powershell
# Install MongoDB
choco install mongodb

# Start MongoDB service
net start MongoDB
```

### Method 3: Using Winget (Windows Package Manager)

```powershell
# Install MongoDB
winget install MongoDB.Server

# Start MongoDB service
net start MongoDB
```

## Verify MongoDB is Running

1. **Check Service Status:**
   ```powershell
   Get-Service -Name MongoDB
   ```

2. **Test Connection:**
   ```powershell
   # Connect to MongoDB shell
   mongo
   # Or if using newer version
   mongosh
   ```

3. **Using MongoDB Compass (GUI):**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`

## MongoDB Basic Commands

```javascript
// In MongoDB shell (mongo or mongosh)
show dbs                    // List all databases
use erp_system             // Switch to ERP database
show collections           // List collections in current database
db.users.find()           // View all users
db.students.find()        // View all students
```

## Common MongoDB Service Commands

```powershell
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Restart MongoDB service
net stop MongoDB && net start MongoDB
```

## Troubleshooting

### If MongoDB Service Won't Start:

1. **Check if port 27017 is in use:**
   ```powershell
   netstat -an | findstr :27017
   ```

2. **Manual start (if service fails):**
   ```powershell
   # Navigate to MongoDB bin directory (usually)
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   
   # Start MongoDB manually
   .\mongod.exe --dbpath "C:\data\db"
   ```

3. **Create data directory if missing:**
   ```powershell
   mkdir C:\data\db
   ```

### If Connection Fails:

1. **Check MongoDB is listening:**
   ```powershell
   netstat -an | findstr :27017
   ```

2. **Check Windows Firewall** (if applicable)

3. **Check MongoDB log files:**
   - Location: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

## Next Steps

After MongoDB is installed and running:

1. **Verify the connection:**
   ```bash
   cd backend
   node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/erp_system').then(() => {console.log('✅ MongoDB Connected'); process.exit(0);}).catch(err => {console.error('❌ MongoDB Connection Failed:', err); process.exit(1);});"
   ```

2. **Start the full application:**
   ```bash
   npm run dev:all
   ```