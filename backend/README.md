# ERP System Backend

A comprehensive Node.js backend for an Educational Resource Planning (ERP) system built with Express.js, MongoDB, and JWT authentication.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for Students, Faculty, and Admin roles
- **Attendance Management**: Digital attendance tracking and reporting
- **Fee Management**: Student fee tracking, payment history, and automated calculations
- **Notice Board**: Announcements and notifications system
- **Help Desk**: Ticket-based support system
- **RESTful APIs**: Well-structured API endpoints with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher) installed
2. **MongoDB** installed locally OR a MongoDB Atlas account
3. **npm** or **yarn** package manager

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Update the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/erp_system
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   ```

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo service mongod start
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in `.env`

## Running the Application

1. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

2. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

3. **Server will start on:** `http://localhost:5000`

## Sample Login Credentials

After running the seeder, you can use these credentials:

- **Student**: 
  - Username: `student001`
  - Password: `Password123`

- **Faculty**: 
  - Username: `prof.smith`
  - Password: `Password123`

- **Admin**: 
  - Username: `admin`
  - Password: `Admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/change-password` - Change password

### Student APIs
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/profile` - Student profile
- `GET /api/student/attendance` - Attendance records
- `GET /api/student/schedule` - Class schedule

### Faculty APIs
- `GET /api/faculty/dashboard` - Faculty dashboard
- `GET /api/faculty/students` - Students taught by faculty
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/faculty/reports/attendance` - Attendance reports

### Fee Management
- `GET /api/fee/student` - Student fee details
- `GET /api/fee/student/summary` - Fee summary
- `POST /api/fee/payment/initiate` - Initiate payment

### Notice Board
- `GET /api/notice` - Get notices
- `POST /api/notice` - Create notice (Faculty/Admin)
- `GET /api/notice/:id` - Get single notice

### Help Desk
- `POST /api/helpdesk/ticket` - Create support ticket
- `GET /api/helpdesk/tickets` - Get user tickets
- `POST /api/helpdesk/ticket/:id/comment` - Add comment

## API Documentation

The API follows RESTful conventions with consistent response formats:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Project Structure

```
backend/
├── models/          # Mongoose schemas and models
├── routes/          # Express route handlers
├── middleware/      # Custom middleware (auth, validation, etc.)
├── utils/           # Utility functions and helpers
├── .env             # Environment variables
├── server.js        # Main application file
├── seed.js          # Database seeder script
└── package.json     # Dependencies and scripts
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator for request validation
- **CORS**: Configured for frontend integration
- **Environment Variables**: Sensitive data in environment files

## Error Handling

The application includes comprehensive error handling:
- Mongoose validation errors
- JWT token errors
- Custom application errors
- 404 route handlers

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.