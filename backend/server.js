const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const facultySimpleRoutes = require('./routes/faculty_simple');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fee');
const noticeRoutes = require('./routes/notice');
const helpdeskRoutes = require('./routes/helpdesk');
const dropoutRoutes = require('./routes/dropout'); // Add this line

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default port
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultySimpleRoutes); // Use simplified faculty routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/dropout', dropoutRoutes); // Add this line

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ERP Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system', {
      serverSelectionTimeoutMS: 30000, // Increase server selection timeout
      socketTimeoutMS: 45000, // Increase socket timeout
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.stack 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`
🚀 ERP Backend Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/api/health
    `);
  });
};

startServer();

module.exports = app;