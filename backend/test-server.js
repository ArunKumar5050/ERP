// Simple test server to verify API structure
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ERP Backend Server is running (Test Mode)',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      student: '/api/student/*',
      faculty: '/api/faculty/*',
      attendance: '/api/attendance/*',
      fee: '/api/fee/*',
      notice: '/api/notice/*',
      helpdesk: '/api/helpdesk/*'
    }
  });
});

// Mock auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    res.json({
      success: true,
      message: 'Login successful (Mock)',
      data: {
        token: 'mock-jwt-token',
        user: {
          username,
          role: username.includes('student') ? 'student' : 
                username.includes('prof') ? 'faculty' : 'admin',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Username and password required'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found in test mode`,
    note: 'This is a test server. Install MongoDB and use "npm run dev" for full functionality.'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
🧪 ERP Backend Test Server is running!
📡 Port: ${PORT}
🌍 Mode: Test (No Database Required)
🔗 Health Check: http://localhost:${PORT}/api/health
🔗 Mock Login: http://localhost:${PORT}/api/auth/login

Note: This is a test server for API structure verification.
For full functionality, install MongoDB and run: npm run dev
  `);
});