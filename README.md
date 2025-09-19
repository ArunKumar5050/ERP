# ERP System - Educational Resource Planning

A comprehensive full-stack Educational Resource Planning (ERP) system built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### For Students
- **Dashboard**: View attendance, upcoming classes, pending fees
- **Attendance Tracking**: Real-time attendance monitoring with analytics
- **Fee Management**: View fee structure, payment history, make payments
- **Notice Board**: Latest announcements and updates
- **Help Desk**: Submit support tickets and track resolution

### For Faculty
- **Dashboard**: Overview of classes, students, and performance metrics
- **Attendance Management**: Mark and manage student attendance
- **Student Monitoring**: Track at-risk students and performance
- **Class Scheduling**: Manage class schedules and timetables
- **Reports**: Generate attendance and performance reports

### For Administrators
- **User Management**: Manage students, faculty, and system users
- **System Analytics**: Institution-wide reports and analytics
- **Notice Management**: Create and manage announcements
- **Help Desk Management**: Handle support tickets and resolutions

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
2. **MongoDB** (v5.0 or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
3. **Git** - [Download Git](https://git-scm.com/)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd ERP
   ```

2. **Run the automated setup:**
   
   **For PowerShell users:**
   ```powershell
   .\start-dev.ps1
   ```
   
   **For Command Prompt users:**
   ```cmd
   start-dev.bat
   ```

   The script will:
   - Check MongoDB installation and status
   - Install all dependencies
   - Verify database connection
   - Optionally seed sample data
   - Start both frontend and backend servers

### Option 2: Manual Setup

1. **Install MongoDB:**
   - Follow the guide in `MONGODB_LOCAL_SETUP.md`
   - Ensure MongoDB is running on port 27017

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure environment:**
   ```bash
   # Backend environment is already configured for local MongoDB
   # Check backend/.env file
   ```

4. **Seed the database (optional but recommended):**
   ```bash
   npm run seed
   ```

5. **Start the development servers:**
   ```bash
   npm run dev
   ```

## 🌐 Application URLs

Once running, access the application at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 🔑 Sample Login Credentials

After seeding the database, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| Student | `student001` | `Password123` |
| Faculty | `prof.smith` | `Password123` |
| Admin | `admin` | `Admin123` |

## 📁 Project Structure

```
ERP/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # API configuration
│   │   └── main.jsx       # Application entry point
│   ├── package.json
│   └── vite.config.js
├── backend/               # Node.js backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json
├── start-dev.ps1          # PowerShell startup script
├── start-dev.bat          # Batch startup script
└── README.md              # This file
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run seed` - Seed database with sample data
- `npm run build` - Build frontend for production

### Frontend Only
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run preview` - Preview production build

### Backend Only
- `cd backend && npm run dev` - Start backend with nodemon
- `cd backend && npm start` - Start backend in production mode
- `cd backend && npm run seed` - Seed database

## 🗄️ Database

### Local MongoDB Setup
1. Install MongoDB Community Server
2. Start MongoDB service: `net start MongoDB` (Windows)
3. Default connection: `mongodb://localhost:27017/erp_system`

### Sample Data
The application includes sample data for testing:
- 5 users (2 students, 2 faculty, 1 admin)
- Student profiles with academic information
- Faculty profiles with subjects and schedules
- Attendance records for the last 10 days
- Fee records for multiple semesters
- Sample notices and announcements

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Student Endpoints
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/attendance` - Attendance records
- `GET /api/fee/student` - Fee information

### Faculty Endpoints
- `GET /api/faculty/dashboard` - Faculty dashboard
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/faculty/students` - Managed students

## 🐛 Troubleshooting

### MongoDB Issues
```bash
# Check if MongoDB is running
netstat -an | findstr :27017

# Start MongoDB service (Windows)
net start MongoDB

# Check MongoDB logs
# Location: C:\Program Files\MongoDB\Server\7.0\log\mongod.log
```

### Port Conflicts
```bash
# Check what's using port 5000 or 5173
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process using the port (replace PID)
taskkill /PID <PID> /F
```

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use the install script
npm run install:all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review the MongoDB setup guide in `MONGODB_LOCAL_SETUP.md`
- Create an issue in the repository

## 🎉 Next Steps

After successful setup:
1. Explore the student dashboard with sample data
2. Try faculty features like marking attendance
3. Test the notice board and help desk functionality
4. Customize the application for your institution's needs

---

**Happy Coding! 🚀**